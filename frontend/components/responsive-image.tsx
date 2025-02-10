"use client";

import { useState } from "react";
import { CardContent } from "./ui/card";

export default function Image({ src }: { src: string }) {
  const [ratio, setRatio] = useState<number>(0);
  const ratioCallback = (target: HTMLImageElement | null) => {
    if (!target) {
      return;
    }
    setRatio(target.naturalWidth / target.naturalHeight);
  };
  return (
    <CardContent
      style={ratio ? { aspectRatio: ratio } : {}}
      id="card-content"
      className="p-0"
    >
      <img ref={ratioCallback} src={src}></img>
    </CardContent>
  );
}
