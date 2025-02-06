import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authenticatedRole, authUid, crudPolicy } from "drizzle-orm/neon";
import { sql } from "drizzle-orm";

export const images = pgTable(
  "images",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: text()
      .notNull()
      .default(sql`(auth.user_id())`),
    url: text("url").notNull(),
    category: text("category").notNull(),
    correctCategory: boolean("correct_category"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    // we use rls to restrict access to rows based on the user that created them
    // this way we don't have to manage this in our application code
    crudPolicy({
      role: authenticatedRole,
      // everyone can read this is needed for the statistics
      read: true,
      // only user that created table can modify it
      modify: authUid(table.userId),
    }),
  ],
);
