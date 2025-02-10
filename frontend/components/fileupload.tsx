"use client";

import { getResponse, postResponse } from "@/app/api/images/types";
import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";

async function getSignedUrl() {
  const res = await fetch("/api/images");
  const body = await getResponse.parseAsync(await res.json());
  return body.url;
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

  const upload = async () => {
    const signedUrl = await getSignedUrl();

    await uploadFile(signedUrl, file, setProgress);

    const res = await fetch("/api/images", {
      method: "POST",
      body: JSON.stringify({ url: signedUrl }),
    });
    const body = await postResponse.parseAsync(await res.json());
    uploaded?.(body.id);
  };

  return (
    <>
      <img
        ref={img}
        src={url}
        onLoad={() => console.log(img.current!.naturalHeight)}
      ></img>
      <button onClick={upload}>Upload</button>
      {progress !== undefined && <Progress value={progress} />}
    </>
  );
}
