import { ownerDb } from "@/src/db/db";
import { eq } from "drizzle-orm";
import { images } from "@/src/db/schema";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Header from "@/components/header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ResponsiveImage from "@/components/responsive-image";

export default async function CategorizeImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  // todo: use authenticated db
  const image = await ownerDb.query.images.findFirst({
    where: eq(images.id, slug),
  });

  if (!image) {
    return <h1>Not found</h1>;
  }
  if (image.correctCategory) {
    return <h1>Already categorized</h1>;
  }

  return (
    <div id="image-categorizer" className="h-full w-full flex flex-col">
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Upload</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Categorize</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Card
        id="card"
        className="flex-1 overflow-auto self-center m-1 rounded-md max-w-full grid grid-rows-[auto_1fr_auto]"
      >
        <CardHeader>
          <CardTitle>Categorize Image</CardTitle>
        </CardHeader>
        <ResponsiveImage
          src={`https://cplabr2.conblem.me/${image.url}`}
        ></ResponsiveImage>
      </Card>
      {/*<CardFooter>*/}
      {/*  <h2>{image.category}</h2>*/}
      {/*  <form*/}
      {/*    action={async () => {*/}
      {/*      "use server";*/}
      {/*      // todo: use authenticated db*/}
      {/*      await ownerDb*/}
      {/*        .update(images)*/}
      {/*        .set({ correctCategory: true })*/}
      {/*        .where(eq(images.id, slug));*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <button type="submit">Correct</button>*/}
      {/*  </form>*/}
      {/*  <form*/}
      {/*    action={async () => {*/}
      {/*      "use server";*/}
      {/*      // todo: use authenticated db*/}
      {/*      await ownerDb*/}
      {/*        .update(images)*/}
      {/*        .set({ correctCategory: false })*/}
      {/*        .where(eq(images.id, slug));*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <button type="submit">Incorrect</button>*/}
      {/*  </form>*/}
      {/*</CardFooter>*/}
      {/*</Card>*/}
    </div>
  );
}
