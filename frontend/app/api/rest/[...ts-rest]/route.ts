import { createNextHandler } from "@ts-rest/serverless/next";
import { contract } from "./contract";
import { db, ownerDb } from "@/src/db/db";
import { images } from "@/src/db/schema";
import { eq, isNotNull } from "drizzle-orm";
import { render } from "@react-email/render";
import NotionMagicLink from "@/react-email-starter/emails/notion-magic-link";
import { Resend } from "resend";
import { AwsClient } from "aws4fetch";
import { Client as QStash, Receiver } from "@upstash/qstash";
import { auth } from "@/auth";
import { v4 as uuid } from "uuid";
import categorize from "./categorize";

const resend = new Resend(process.env.RESEND_KEY);
const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});
const qstash = new QStash({ token: process.env.QSTASH_TOKEN! });
const awsClient = new AwsClient({
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_ACCESS_KEY!,
});
const PRESIGN_EXPIRY_SECONDS = 30;

const handler = createNextHandler(
  contract,
  {
    sendEmails: async ({ headers: { authorization } }) => {
      if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return {
          status: 401,
          body: null,
        };
      }

      const addresses = await ownerDb
        .selectDistinct({ email: images.email })
        .from(images)
        .where(isNotNull(images.correctCategory));

      const html = await render(NotionMagicLink({ loginCode: "1234" }));

      const mails = addresses.map((address) => ({
        from: "CPLAB <mail@cplab.conblem.me>",
        to: address.email,
        subject: "Daily Statistics",
        html,
      }));

      const res = await resend.batch.send(mails);
      return { status: res.error ? 500 : 200, body: res };
    },
    presignImage: async () => {
      const session = await auth();
      if (!session) {
        return {
          status: 401,
          body: null,
        };
      }

      const id = uuid();
      const url = new URL(`${process.env.R2_ENDPOINT!}/${id}`);
      url.searchParams.set("X-Amz-Expires", PRESIGN_EXPIRY_SECONDS.toString());

      const signed = await awsClient.sign(
        new Request(url, {
          method: "PUT",
        }),
        {
          aws: { signQuery: true },
        },
      );

      // upstash can only call public urls
      // if you have a public available url you can use this to trigger the PATCH
      if (process.env.VERCEL_URL) {
        await qstash.publishJSON({
          // don't hard code url
          url: `https://${process.env.VERCEL_URL}/api/rest/cleanup-image`,
          method: "POST",
          delay: PRESIGN_EXPIRY_SECONDS * 2,
          body: {
            url: id,
          },
        });
      }

      return {
        status: 200,
        body: {
          url: signed.url,
        },
      };
    },
    insertImage: async ({ body }) => {
      const session = await auth();
      if (!session?.user?.email) {
        return {
          status: 401,
          body: null,
        };
      }

      const url = new URL(body.url);
      const uuid = url.pathname.replace("/cplab/", "");

      const category = await categorize(`https://cplabr2.conblem.me/${uuid}`);
      const res = await db
        .insert(images)
        .values({
          url: uuid,
          category,
          email: session.user.email,
        })
        .returning();
      return {
        status: 200,
        body: {
          id: res[0].id,
        },
      };
    },
    cleanupImage: async (
      { headers: { ["upstash-signature"]: signature }, body: { url } },
      { nextRequest },
    ) => {
      const isValid = await receiver.verify({
        body: await nextRequest.clone().text(),
        signature,
      });
      if (!isValid) {
        return {
          status: 401,
          body: null,
        };
      }

      const image = await ownerDb.query.images.findFirst({
        where: eq(images.url, url),
      });

      if (image) {
        return {
          status: 200,
          body: null,
        };
      }

      // if image has not been added by now we delete the uploaded file from s3
      // so we don't have any orphaned files
      const deleteImage = await awsClient.sign(
        `${process.env.R2_ENDPOINT}/${url}`,
        {
          method: "DELETE",
        },
      );
      const res = await fetch(deleteImage);
      return {
        status: 200,
        body: await res.text(),
      };
    },
  },
  {
    handlerType: "app-router",
  },
);

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
};
