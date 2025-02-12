import { images } from "@/src/db/schema";
import { count, isNotNull } from "drizzle-orm";
import { db } from "@/src/db/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import Header from "@/components/header";

export default async function Statistic() {
  const statistics = await db
    .select({
      correctCategory: images.correctCategory,
      count: count(images.id),
    })
    .from(images)
    .where(isNotNull(images.correctCategory))
    .groupBy(images.correctCategory);
  return (
    <>
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Statistics</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      {statistics.map((statistic, i) => (
        <div key={i}>
          {statistic.correctCategory!.toString()} {statistic.count}
        </div>
      ))}
    </>
  );
}
