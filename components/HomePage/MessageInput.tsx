"use client";

import type React from "react";
import { useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { useChatStore } from "@/utils/store";
import { io } from "socket.io-client";
import { useUser } from "@clerk/nextjs";
import { Message } from "@/utils/store";
import axios from "axios";
import { setActiveChatPage } from "@/utils/store";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const { addMessage } = useChatStore();
  const { user } = useUser();
  const socket = io();
  const { activeChat } = setActiveChatPage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailAddress = user?.primaryEmailAddress?.emailAddress;

    const msg: Message = {
      id: user?.id as string,
      sender: user?.fullName ?? (emailAddress?.toUpperCase() as string),
      sender_id: user?.id as string,
      content: message,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      chat_Id: activeChat.id,
    };

    console.log(msg);

    socket.emit("send_message", msg);
    addMessage(msg);
    setMessage("");

    await axios.post("/api/sendMessage", { message: msg });
  };

  const userTyping = (e: string) => {
    setMessage(e);
  };

  return (
    <div className="border-t p-4 dark:border-gray-800">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <Input hidden type="file" />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-9 w-9 rounded-full"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <Input
          value={message}
          id="message"
          onChange={(e) => userTyping(e.target.value)}
          placeholder="Type a message..."
          className="min-h-[2.5rem] flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-9 w-9 rounded-full"
        >
          <Smile className="h-5 w-5" />
          <span className="sr-only">Add emoji</span>
        </Button>
        <Button
          type="submit"
          disabled={message.trim() === ""}
          size="icon"
          className="h-9 w-9 rounded-full focus:bg-sidebar-ring hover:cursor-pointer"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
