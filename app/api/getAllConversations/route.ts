import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { conversation, conversationParticipants } from "@/schema/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest) {
  try {
    const { userId: id } = await auth();

    const allConversations = await db
      .select()
      .from(conversationParticipants)
      .where(eq(conversationParticipants.user_Id, id));

    const roomIds = await Promise.all(
      allConversations.map(async (id) => {
        try {
          const roomId = id.room_id as string;
          const data = await GetConversations(roomId);

          if (!data) {
            console.log("Conversations empty");

            return null;
          }
          return data;
        } catch (error) {
          throw new Error("Error occurred", error);
        }
      })
    );
    return NextResponse.json(roomIds);
  } catch (error: any) {
    console.log(error);
    throw new Error("Error occurred: ", error);
  }
}

export const GetConversations = async (roomId: string) => {
  try {
    const data = await db
      .select()
      .from(conversation)
      .where(eq(conversation.room_id, roomId));
    return data;
  } catch (error) {
    console.log(error);
  }
};
