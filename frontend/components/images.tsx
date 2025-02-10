"use server";

import { ownerDb } from "@/src/db/db";
import { images } from "@/src/db/schema";
import Image from "next/image";

export async function Images() {
  // auth is handled by rls so this component cannot be misused
  // as the user has to be authenticated to access this component
  // todo: switch back to normal db
  const imagesResult = await ownerDb.select().from(images);

  return imagesResult.map((image) => (
    <>
      <div key={image.id} className="w-[100px] h-[100px] relative">
        <Image
          src={`https://cplabr2.conblem.me/${image.url}`}
          alt="Test"
          fill
          objectFit="cover"
        />
      </div>
      <h2>{image.category}</h2>
      <h2>{`${image.correctCategory}`}</h2>
    </>
  ));
}
