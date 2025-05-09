import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/schema/schema";
import { eq } from "drizzle-orm";

export async function POST(_req: NextRequest) {
  const user = await currentUser();
  const id = user?.id as string;
  try {
    const existingUsers = await db.select().from(users).where(eq(users.id, id));

    if (existingUsers.length === 0) {
      await db.insert(users).values({
        id: user?.id as string,
        email: user?.emailAddresses[0].emailAddress as string,
        image: user?.imageUrl as string,
      });

      return NextResponse.json("User created!");
    }
  } catch (error: any) {
    throw new Error("Error: ", error.data);
  }

  return NextResponse.json("Action completed");
}
