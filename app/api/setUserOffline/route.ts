import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/schema/schema";
import { eq } from "drizzle-orm";

export async function POST(_req: NextRequest, _rep: NextResponse) {
  const data = await _req.json();
  const { id } = data;

  if (!id) {
    return;
  }
  try {
    await db.update(users).set({ status: false }).where(eq(users.id, id));
  } catch (error: any) {
    console.log(error);
    throw new Error("Error occurred: ", error);
  }

  return NextResponse.json("Action Completed");
}
