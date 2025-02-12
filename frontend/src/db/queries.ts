import { db } from "@/src/db/db";
import { images } from "@/src/db/schema";
import { and, count, eq, isNotNull, sql } from "drizzle-orm";

export async function getUserStatistic() {
  return db
    .select({
      correctCategory: images.correctCategory,
      count: count(images.id),
    })
    .from(images)
    .where(
      and(
        isNotNull(images.correctCategory),
        eq(images.userId, sql`(auth.user_id())`),
      ),
    )
    .groupBy(images.correctCategory);
}

export async function getOverallStatistic() {
  return db
    .select({
      correctCategory: images.correctCategory,
      count: count(images.id),
    })
    .from(images)
    .where(isNotNull(images.correctCategory))
    .groupBy(images.correctCategory);
}
