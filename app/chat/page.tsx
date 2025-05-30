"use server";

import ChatPage from "@/components/ChatPage/ChatPage";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function MainChatPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }
  return (
    <>
      <ChatPage />
    </>
  );
}
export default MainChatPage;
