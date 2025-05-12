import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { messages } from "@/schema/schema";

export async function POST(_req: NextRequest, _res: NextResponse) {
  try {
    const item = await _req.json();
    const { message } = item;

    await db.insert(messages).values({
      sender_id: message.sender_id,
      conversation_id: message.chat_Id,
      email: message.sender,
      message: message.content,
    });

    return NextResponse.json("Response");
  } catch (error: any) {
    console.log(error);
    throw new Error("Error occurred: ", error);
  }
}

//  id: uuid("id").defaultRandom().notNull(),
//   sender_id: text("sender_id").notNull(),
//   email: text("email").notNull(),
//   message: text("message").notNull(),
//   createdAt: timestamp("createdAt").defaultNow().notNull(),
//   conversation_id: uuid("conversation_id")
//     .notNull()
//     .references(() => conversation.id),
