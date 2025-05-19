import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { messages } from "@/schema/schema";
import { db } from "@/lib/db";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(_req: NextRequest) {
  try {
    const formData = await _req.formData();
    const file = formData.get("file") as File;
    const messageRaw = formData.get("message") as string;
    const message = JSON.parse(messageRaw);

    console.log("What is inside here ", file);

    // const arrayBuffer = await file.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);

    if (file) {
      const filePath = `${Date.now()}-${file.name}`;
      await supabase.storage.from("uploads").upload(filePath, file);

      const { data: getFullUrlPath } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      await db.insert(messages).values({
        sender_id: message.sender_id,
        room_Id: message.room_Id,
        email: message.sender,
        message: message.content,
        sender_image: message.sender_image,
        files: getFullUrlPath.publicUrl,
      });

      return NextResponse.json(getFullUrlPath.publicUrl);
    } else {
      await db.insert(messages).values({
        sender_id: message.sender_id,
        room_Id: message.room_Id,
        email: message.sender,
        message: message.content,
        sender_image: message.sender_image,
        files: "",
      });

      return NextResponse.json("");
    }
  } catch (error: any) {
    console.log(error);
    throw new Error("Error occurred: ", error);
  }
}
