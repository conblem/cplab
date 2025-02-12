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
import { Card, CardFooter } from "@/components/ui/card";
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
    <>
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
        className="w-full h-full flex flex-col items-center p-4 overflow-x-hidden"
      >
        <Card
          id="card"
          className="relative max-w-full max-h-full flex flex-col"
        >
          <img
            className="rounded-lg h-full"
            src={`https://cplabr2.conblem.me/${image.url}`}
          ></img>
          <CardFooter className="absolute bottom-0 right-0 left-0 bg-white p-6 rounded-bl-lg rounded-br-lg">
            <h2>{image.category}</h2>
            <form
              action={async () => {
                "use server";
                await db
                  .update(images)
                  .set({ correctCategory: true })
                  .where(eq(images.id, slug));
              }}
            >
              <button type="submit">Correct</button>
            </form>
            <form
              action={async () => {
                "use server";
                await db
                  .update(images)
                  .set({ correctCategory: false })
                  .where(eq(images.id, slug));
              }}
            >
              <button type="submit">Incorrect</button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
