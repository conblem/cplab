import { images } from "@/src/db/schema";
import { db } from "@/src/db/db";
import ImagesArchive from "@/components/image-archive";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import Header from "@/components/header";
import { desc } from "drizzle-orm";

export default async function Archive() {
  // auth is handled by rls so this component cannot be misused
  // as the user has to be authenticated to access this component
  const imagesList = await db
    .select()
    .from(images)
    .orderBy(desc(images.updatedAt));
  return (
    <>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Archive</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>

      <ImagesArchive imagesList={imagesList}></ImagesArchive>
    </>
  );
}
