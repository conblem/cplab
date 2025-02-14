import { eq } from "drizzle-orm";
import { images } from "@/src/db/schema";
import { db } from "@/src/db/db";
import { redirect } from "next/navigation";
import Header from "@/components/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Card, CardFooter } from "@/components/ui/card";
import ActionSubmitButton from "@/components/action-submit-button";

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
    redirect("/404");
  }
  // if (image.correctCategory) {
  //   return <h1>Already categorized</h1>;
  // }

  async function correct() {
    "use server";
    await db
      .update(images)
      .set({ correctCategory: true })
      .where(eq(images.id, slug));
  }

  async function incorrect() {
    "use server";
    await db
      .update(images)
      .set({ correctCategory: false })
      .where(eq(images.id, slug));
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
      <div className="w-full h-full flex flex-col items-center p-4 overflow-x-hidden">
        <Card
          id="card"
          className="relative max-w-full max-h-full flex flex-col"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="rounded-lg h-full"
            src={`https://cplabr2.conblem.me/${image.url}`}
            alt="Uploaded Image"
          ></img>
          <CardFooter className="absolute bottom-0 right-0 left-0 bg-white p-6 rounded-bl-lg rounded-br-lg flex gap-2">
            <h2 className="flex-1 capitalize">{image.category}</h2>
            <form action={correct}>
              <ActionSubmitButton>Correct</ActionSubmitButton>
            </form>
            <form action={incorrect}>
              <ActionSubmitButton>Incorrect</ActionSubmitButton>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
