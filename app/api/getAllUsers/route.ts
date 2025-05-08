import { NextRequest, NextResponse } from "next/server";
import db from "@/prisma/db";
export async function GET(req: NextRequest) {
  try {
    const data = await db.users.findMany({ orderBy: { createdAt: "desc" } });

    return NextResponse.json(data);
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json(error);
  }
}
