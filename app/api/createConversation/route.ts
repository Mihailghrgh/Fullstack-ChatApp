import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { conversation, conversationParticipants } from "@/schema/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

export async function POST(_req: NextRequest) {
  const data = await _req.json();
  const { id, image, email } = data;
  const { userId } = await auth();
  const newRoom = `room_${userId}_${id}`;

  try {
    const existingRoom = await db
      .select()
      .from(conversation)
      .where(eq(conversation.room_id, newRoom));

    if (existingRoom.length === 0) {
      await db
        .insert(conversation)
        .values({ room_id: newRoom, name: email, image: image });

      await db.insert(conversationParticipants).values([
        { user_Id: id, room_id: newRoom },
        { user_Id: userId, room_id: newRoom },
      ]);

      return NextResponse.json("Action completed");
    }
  } catch (error: unknown) {
    throw new Error(error);
  }
}
