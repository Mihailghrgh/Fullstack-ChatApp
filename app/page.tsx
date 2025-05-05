"use client";

import ChatArea from "@/components/HomePage/ChatArea";
import Sidebar from "@/components/HomePage/Sidebar";
import MessageInput from "@/components/HomePage/MessageInput";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-950">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <ChatArea />
        <MessageInput />
      </div>
    </div>
  );
}
