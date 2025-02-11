"use client";

import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import client from "@/src/client";

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
}: {
  file: File;
  uploaded?: (url: string) => void;
}) {
  const [progress, setProgress] = useState<number>();
  const url = URL.createObjectURL(file);
  const img = useRef<HTMLImageElement>(null);
  console.log(progress);

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
    <>
      <img ref={img} src={url}></img>
      <button onClick={upload}>Upload</button>
      {progress !== undefined && <Progress value={progress} />}
    </>
  );
}
