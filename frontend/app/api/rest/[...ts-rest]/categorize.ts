import {
  DetectLabelsCommand,
  RekognitionClient,
} from "@aws-sdk/client-rekognition";

const rekognitionClient = new RekognitionClient({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function categorize(url: string) {
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
