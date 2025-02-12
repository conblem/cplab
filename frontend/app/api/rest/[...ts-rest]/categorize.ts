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

function includes(labels: (string | undefined)[], ...tests: string[]) {
  return tests.some((test) => labels.includes(test));
}

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

  if (includes(lowerCaseLabels, "human", "person")) {
    return "human";
  }
  if (includes(lowerCaseLabels, "dog", "cat", "animal", "bird")) {
    return "animal";
  }
  if (includes(lowerCaseLabels, "car", "vehicle", "truck")) {
    return "car";
  }
  if (includes(lowerCaseLabels, "landscape", "nature", "outdoors", "forest")) {
    return "landscape";
  }
  return "undefined";
}
