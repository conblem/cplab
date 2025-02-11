"use client";

import { images } from "@/src/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { Card, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function ImageArchive({
  imagesList,
}: {
  imagesList: InferSelectModel<typeof images>[];
}) {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 overflow-x-hidden items-center">
      {imagesList.map((image) => (
        <Card
          id="card"
          key={image.id}
          className="group max-w-full max-h-full flex flex-col relative"
        >
          <CardFooter
            id="footer"
            className="flex space-x-2 absolute bottom-0 left-0 bg-white rounded-tr-lg rounded-bl-lg pt-6 group-hover:opacity-0 transition-opacity duration-100 ease-in"
          >
            <Label>Category: {image.category}</Label>
            <Checkbox checked={image.correctCategory!} />
          </CardFooter>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            id="image"
            className="rounded-lg h-full"
            src={`https://cplabr2.conblem.me/${image.url}`}
            alt="Image"
          ></img>
        </Card>
      ))}
    </div>
  );
}
