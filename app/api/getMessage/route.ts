import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { messages } from "@/schema/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest) {
  try {
    const { searchParams } = new URL(_req.url);
    const id = searchParams.get("id");

    const data = await db
      .select()
      .from(messages)
      .where(eq(messages.room_Id, id));

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    throw new Error("Error occurred: ", error);
  }
}
