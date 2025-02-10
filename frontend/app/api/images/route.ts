import { NextRequest, NextResponse } from "next/server";
import { ownerDb } from "@/src/db/db";
import { images } from "@/src/db/schema";
import { auth } from "@/auth";
import { AwsClient } from "aws4fetch";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { getResponse, patchRequest, postRequest } from "@/app/api/images/types";
import { Client as QStash } from "@upstash/qstash";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { eq } from "drizzle-orm";
import {
  DetectLabelsCommand,
  RekognitionClient,
} from "@aws-sdk/client-rekognition";

const PRESIGN_EXPIRY_SECONDS = 30;

const rekognitionClient = new RekognitionClient({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_ACCESS_KEY!,
  },
});

async function categorize(url: string) {
  const req = await fetch(url);

  const labels = await rekognitionClient.send(
    new DetectLabelsCommand({
      Image: {
        Bytes: await req.bytes(),
      },
      MaxLabels: 10,
      MinConfidence: 70,
    }),
  );
  const lowerCaseLabels =
    labels?.Labels?.map((label) => label.Name?.toLowerCase()) ?? [];

  if (lowerCaseLabels.includes("person") || lowerCaseLabels.includes("human")) {
    return "human";
  }
  return "undefined";
}

export const POST = auth(async function POST(req) {
  if (!req.auth?.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const body = await postRequest.parseAsync(await req.json());
  const url = new URL(body.url);
  const uuid = url.pathname.replace("/cplab/", "");

  const category = await categorize(`https://cplabr2.conblem.me/${uuid}`);
  // todo: switch back to normal db
  const res = await ownerDb
    .insert(images)
    .values({
      url: uuid,
      category,
      userId: req.auth.user.id,
    })
    .returning();
  return NextResponse.json({ id: res[0].id });
});

const awsClient = new AwsClient({
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_ACCESS_KEY!,
});
const qstash = new QStash({ token: process.env.QSTASH_TOKEN! });

export const GET = auth(async function GET(req): Promise<
  NextResponse<{ message: string } | z.infer<typeof getResponse>>
> {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
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
      url: `https://${process.env.VERCEL_URL}/api/images`,
      method: "PATCH",
      delay: PRESIGN_EXPIRY_SECONDS * 2,
      body: {
        url: id,
      },
    });
  }

  return NextResponse.json({
    url: signed.url,
  });
});

// this task cleans up r2 images that have not been added to the database
export const PATCH = verifySignatureAppRouter(async function PATCH(
  req: NextRequest,
) {
  const body = await patchRequest.parseAsync(await req.json());
  // we query the database using the ownerDb as we are not in the user context in here
  const image = await ownerDb.query.images.findFirst({
    where: eq(images.url, body.url),
  });

  if (image) {
    return NextResponse.json({ message: "ok" });
  }

  // if image has not been added by now we delete the uploaded file from s3
  // so we don't have any orphaned files
  const deleteImage = await awsClient.sign(
    `${process.env.R2_ENDPOINT}/${body.url}`,
    {
      method: "DELETE",
    },
  );
  const res = await fetch(deleteImage);
  return new NextResponse(res.body, { status: res.status });
});
