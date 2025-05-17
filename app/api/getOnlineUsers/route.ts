import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/schema/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest) {
  const { searchParams } = new URL(_req.url);
  const id = searchParams.get("id") as string;
  try {
    const data = await db.select().from(users).where(eq(users.id, id));
    const { status } = data[0];

    return NextResponse.json(status);
  } catch (error: any) {
    console.log(error);
    throw new Error("Error occurred", error);
  }
}
