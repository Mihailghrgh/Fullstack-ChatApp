"use server";
import ChatPage from "@/components/HomePage/ChatPage";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  
  return <ChatPage />;
}
