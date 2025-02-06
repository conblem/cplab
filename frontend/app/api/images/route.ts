import { NextResponse } from "next/server";
import { db } from "@/src/db/db";
import { images } from "@/src/db/schema";

export const GET = async function GET() {
  // no auth check needed as database performs this task
  const res = await db.insert(images).values({
    url: "https://picsum.photos/id/0/5000/3333",
    category: "test",
  });
  return NextResponse.json(res.command);
};
