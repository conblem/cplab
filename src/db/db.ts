import "server-only";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { auth } from "@/auth";
import * as schema from "@/src/db/schema";

const databaseUrl = new URL(process.env.DATABASE_URL!);
const DATABASE_AUTHENTICATED_URL = databaseUrl
  .toString()
  .replace(
    `${databaseUrl?.username}:${databaseUrl?.password}`,
    "authenticated",
  );

// we extract the jwt from the session and pass it to the database
// using neon authorize the database can use the jwt to authenticate the user
// thus allowing rls to work, pretty nifty
export async function getJWT() {
  const session = await auth();
  if (!session || !("jwt" in session) || typeof session.jwt !== "string") {
    throw new Error("No jwt");
  }
  return session.jwt;
}

export const db = drizzle({
  client: neon(DATABASE_AUTHENTICATED_URL, {
    authToken: getJWT,
  }),
  schema,
});
export const ownerDb = drizzle({
  client: neon(process.env.DATABASE_URL!),
  schema,
});
