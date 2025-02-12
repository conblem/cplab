import { createNextHandler } from "@ts-rest/serverless/next";
import { contract } from "./contract";
import { db, ownerDb } from "@/src/db/db";
import { images } from "@/src/db/schema";
import { count, isNotNull, sql } from "drizzle-orm";
import { CreateBatchOptions, Resend } from "resend";
import { AwsClient } from "aws4fetch";
import { auth } from "@/auth";
import { v4 as uuid } from "uuid";
import categorize from "./categorize";
import Email from "@/react-email-starter/emails/email";

async function getUsersStatistic() {
  return ownerDb
    .select({
      email: images.email,
      correct: sql<number>`COUNT(*) FILTER (WHERE ${images.correctCategory} IS TRUE)`,
      incorrect: sql<number>`COUNT(*) FILTER (WHERE ${images.correctCategory} IS FALSE)`,
    })
    .from(images)
    .groupBy(images.email);
}

async function getOverallStatistic() {
  const overallStatistic = await ownerDb
    .select({
      correctCategory: images.correctCategory,
      count: count(images.id),
    })
    .from(images)
    .where(isNotNull(images.correctCategory))
    .groupBy(images.correctCategory);

  const overallCorrect =
    overallStatistic.find((statistic) => statistic.correctCategory === true)
      ?.count ?? 0;

  const overallIncorrect =
    overallStatistic.find((statistic) => statistic.correctCategory === false)
      ?.count ?? 0;

  return { overallCorrect, overallIncorrect };
}

async function emails(): Promise<CreateBatchOptions> {
  const usersStatistic = await getUsersStatistic();
  const { overallCorrect, overallIncorrect } = await getOverallStatistic();

  return usersStatistic.map((userStatistic) => ({
    from: "CPLAB <mail@cplab.conblem.me>",
    to: userStatistic.email,
    subject: "Your Daily Statistics",
    react: Email({
      userCorrect: userStatistic.correct,
      userIncorrect: userStatistic.incorrect,
      overallCorrect,
      overallIncorrect,
    }),
  }));
}

const resend = new Resend(process.env.RESEND_KEY);
const awsClient = new AwsClient({
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_ACCESS_KEY!,
});

const PRESIGN_EXPIRY_SECONDS = 30;
// 4mb
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

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

      const res = await resend.batch.send(await emails());
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

      const req = await fetch(`https://cplabr2.conblem.me/${uuid}`);
      const contentType = req.headers.get("content-type");
      if (!contentType || contentType !== "image/jpeg") {
        throw new Error("Invalid content type");
      }
      const contentLength = req.headers.get("content-length");
      if (!contentLength || parseInt(contentLength) > MAX_IMAGE_SIZE) {
        throw new Error("Image too large");
      }
      const bytes = await req.bytes();
      if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
        throw new Error("Invalid image");
      }

      const category = await categorize(bytes);
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
