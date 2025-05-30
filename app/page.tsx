"use server";
import ChatPage from "@/components/ChatPage/ChatPage";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import HomePage from "@/components/HomePage/HomePage";

export default async function Home() {
  const user = await auth();
  console.log(user);

  return <HomePage />;

}
