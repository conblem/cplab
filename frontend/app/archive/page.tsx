import { images } from "@/src/db/schema";
import { db } from "@/src/db/db";
import ImagesArchive from "@/components/image-archive";

export default async function Archive() {
  // auth is handled by rls so this component cannot be misused
  // as the user has to be authenticated to access this component
  const imagesList = await db.select().from(images);
  return <ImagesArchive imagesList={imagesList}></ImagesArchive>;
}
