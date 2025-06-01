import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { conversation } from "@/schema/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

export async function POST(_req: NextRequest) {
  const data = await _req.json();
  const { id } = data;
  const { userId } = await auth();
  const newRoom = `room_${userId}_${id}`;

  try {
    const existingRoom = await db
      .select()
      .from(conversation)
      .where(eq(conversation.room_id, newRoom));

    if (existingRoom.length === 0) {
      await db.insert(conversation).values({
        room_id: newRoom,
        participants: [{ id: id }, { id: userId }],
      });

      return NextResponse.json("Action completed");
    }
  } catch (error: any) {
    throw new Error(error);
  }
}
