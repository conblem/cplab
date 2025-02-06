import { auth, signIn } from "@/auth";
import { db } from "@/src/db/db";
import { images } from "@/src/db/schema";
import Image from "next/image";
import { isNotNull } from "drizzle-orm";

export default async function Home() {
  const session = await auth();
  if (!session) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn();
        }}
      >
        <button type="submit">Sign in</button>
      </form>
    );
  }

  const imagesResult = await db
    .select()
    .from(images)
    .where(isNotNull(images.correctCategory));

  return (
    <>
      <h1>hoi</h1>
      {imagesResult.map((image) => (
        <div key={image.id} className="w-[100px] h-[100px] relative">
          <Image src={image.url} alt="Test" fill objectFit="cover" />
        </div>
      ))}
    </>
  );
}
