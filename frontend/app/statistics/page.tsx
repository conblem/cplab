import { images } from "@/src/db/schema";
import { and, count, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/src/db/db";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import Header from "@/components/header";
import Statistic from "@/components/statistic";
import { getOverallStatistic, getUserStatistic } from "@/src/db/queries";

export const dynamic = "force-dynamic";

export default async function Statistics() {
  const userStatistic = await getUserStatistic();
  const overallStatistic = await getOverallStatistic();

  const userCorrect =
    userStatistic.find((statistic) => statistic.correctCategory === true)
      ?.count ?? 0;

  const userIncorrect =
    userStatistic.find((statistic) => statistic.correctCategory === false)
      ?.count ?? 0;

  const overallCorrect =
    overallStatistic.find((statistic) => statistic.correctCategory === true)
      ?.count ?? 0;

  const overallIncorrect =
    overallStatistic.find((statistic) => statistic.correctCategory === false)
      ?.count ?? 0;

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
      <Statistic
        userCorrect={userCorrect}
        userIncorrect={userIncorrect}
        overallCorrect={overallCorrect}
        overallIncorrect={overallIncorrect}
      />
    </>
  );
}
