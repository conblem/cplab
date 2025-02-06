import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { auth } from "@/auth";

const sql = neon(process.env.DATABASE_AUTHENTICATED_URL!, {
  authToken: async () => {
    const session = await auth();
    if (!session || !("jwt" in session) || typeof session.jwt !== "string") {
      throw new Error("No jwt");
    }
    console.log("jwt", session.jwt);
    // we extract the jwt from the session and pass it to the database
    // using neon authorize the database can use the jwt to authenticate the user
    // thus allowing rls to work, pretty nifty
    return session.jwt;
  },
});
export const db = drizzle({ client: sql });
