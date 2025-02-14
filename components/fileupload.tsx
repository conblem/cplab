"use client";

import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import client from "@/src/client";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderIcon, X } from "lucide-react";

async function getSignedUrl() {
  const res = await client.presignImage();
  if (res.status !== 200) {
    throw new Error("Failed to get signed URL");
  }
  return res.body.url;
}

function uploadFile(
  url: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<number> {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) =>
      onProgress?.((e.loaded / e.total) * 100),
    );
    xhr.addEventListener("load", () => res(xhr.status));
    xhr.addEventListener("error", () => rej(new Error("File upload failed")));
    xhr.addEventListener("abort", () => rej(new Error("File upload aborted")));
    xhr.open("PUT", url, true);
    xhr.send(file);
    onProgress?.(0);
  });
}

export function FileUpload({
  file,
  uploaded,
  onClose,
}: {
  file: File;
  uploaded?: (url: string) => void;
  onClose?: () => void;
}) {
  const [progress, setProgress] = useState<number>();
  const url = URL.createObjectURL(file);
  const img = useRef<HTMLImageElement>(null);

  const upload = async () => {
    setProgress(0);
    const signedUrl = await getSignedUrl();
    setProgress(10);

    await uploadFile(signedUrl, file, (progress) => {
      setProgress(progress * 0.8 + 10);
    });

    const res = await client.insertImage({ body: { url: signedUrl } });
    if (res.status !== 200) {
      throw new Error("Failed to insert image");
    }
    setProgress(100);
    uploaded?.(res.body.id);
  };

  return (
    <Card className="max-w-full max-h-full flex flex-col relative">
      <Button className="absolute top-0 right-0" onClick={onClose}>
        <X className="invert" />
      </Button>
      <CardFooter className="absolute bottom-0 left-0 right-0 rounded-br-lg rounded-bl-lg bg-white p-2">
        <Button onClick={upload}>Upload</Button>
        {progress != undefined && progress != 100 && (
          <LoaderIcon className="animate-spin" />
        )}
      </CardFooter>
      {progress !== undefined && (
        <Progress
          id="progress"
          value={progress}
          className="*:bg-black rounded-lg absolute bottom-0 left-0 right-0"
        ></Progress>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="rounded-lg h-full" ref={img} src={url} alt="Upload" />
    </Card>
  );
}
