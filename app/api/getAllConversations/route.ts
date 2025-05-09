import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { conversationParticipants } from "@/schema/schema";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest) {
  try {
    const { userId: id } = await auth();

    const allConversations = await db
      .select()
      .from(conversationParticipants)
      .where(eq(conversationParticipants.user_Id, id));

    console.log("Here is the data: ", allConversations);

    return NextResponse.json(allConversations)
  } catch (error: any) {
    console.log(error);
    throw new Error("Error occurred: ", error);
  }
}
