import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { conversation, users } from "@/schema/schema";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";

type Participant = {
  id: string;
};

export async function GET(_req: NextRequest) {
  try {
    const { userId: id } = await auth();

    const conversations = await GetConversations(id as string);

    //Getting the userIds
    const userIds = conversations?.flatMap((item) =>
      (item.participants as Participant[]).map((participant) => {
        const id = participant.id;
        return { id };
      })
    );

    //Getting all conversations in which they are participants, get the details of the user and populate it before returning it to front end
    const finalConversation = await Promise.all(
      (conversations || []).map(async (item) => {
        const participants = item?.participants as Participant[];

        const updatedParticipants = await Promise.all(
          participants.map(async (participant) => {
            try {
              const user = userIds?.find((u) => u.id === participant.id);

              if (!user) {
                return {
                  ...participant,
                  userDetails: null,
                };
              }

              const [userData] = await db
                .select()
                .from(users)
                .where(eq(users.id, user.id));

              return {
                ...participant,
                userDetails: {
                  name: userData.email,
                  image: userData.image,
                },
              };
            } catch (error) {
              console.error("Error fetching user data:", error);
              return {
                ...participant,
                userDetails: null,
              };
            }
          })
        );

        return {
          ...item,
          participants: updatedParticipants,
        };
      })
    );

    console.dir(finalConversation, { depth: null });

    return NextResponse.json(finalConversation);
  } catch (error: any) {
    console.log(error);
    throw new Error("Error occurred: ", error);
  }
}

//Helper function to find all conversations in which the user is a part of
export const GetConversations = async (userId: string) => {
  try {
    const data = await db
      .select()
      .from(conversation)
      .where(sql`participants @> ${JSON.stringify([{ id: userId }])}::jsonb`);

    return data;
  } catch (error) {
    console.log(error);
  }
};

