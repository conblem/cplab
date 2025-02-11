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
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ResponsiveImage from "@/components/responsive-image";
import Link from "next/link";
import { db } from "@/src/db/db";

export default async function CategorizeImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const image = await db.query.images.findFirst({
    where: eq(images.id, slug),
  });

  if (!image) {
    return <h1>Not found</h1>;
  }
  if (image.correctCategory) {
    return <h1>Already categorized</h1>;
  }

  return (
    <div id="image-categorizer" className="w-full h-full">
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/upload">Upload</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Categorize</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <div
        id="card-centerer"
        className="w-full h-[calc(100%-(var(--spacing)*16))] relative"
      >
        <Card
          id="card"
          className="absolute inset-0 ml-auto mr-auto max-h-full max-w-full w-fit h-full grid grid-rows-[auto_1fr_auto]"
        >
          <CardHeader>
            <CardTitle>Categorize Image</CardTitle>
          </CardHeader>
          <ResponsiveImage
            src={`https://cplabr2.conblem.me/${image.url}`}
          ></ResponsiveImage>
          <CardFooter>Footer</CardFooter>
        </Card>
      </div>
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
