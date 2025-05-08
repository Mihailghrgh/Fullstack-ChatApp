import { NextRequest, NextResponse } from "next/server";
import db from "@/prisma/db";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const user = await currentUser();

  console.log("Here is the data: ", user);

  try {
    const existingUser = await db.users.findUnique({ where: { id: user?.id } });

    if (existingUser === null) {
      await db.users.create({
        data: {
          image: user?.imageUrl as string,
          id: user?.id as string,
          email: user?.emailAddresses[0].emailAddress as string,
        },
      });

      return NextResponse.json("User created!");
    }
  } catch (error: any) {
    return NextResponse.json("Error occurred: ", error);
  }

  return NextResponse.json("Action completed");
}
