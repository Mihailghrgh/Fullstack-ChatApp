import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/schema/schema";
import { desc } from "drizzle-orm";

export async function GET(_req: NextRequest) {
  try {
    const data = await db.select().from(users).orderBy(desc(users.createdAt));

    return NextResponse.json(data);
  } catch (error: any) {
    console.log("Error: ", error);
    throw new Error("Error...: ", error.message);
  }
}
