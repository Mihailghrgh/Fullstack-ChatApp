"use client";

import type React from "react";
import { useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { useChatStore } from "@/utils/store";
import { io } from "socket.io-client";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const { addMessage } = useChatStore();
  const socket = io();
  const handleSubmit = (e) => {
    e.preventDefault();

    const msg = {
      id: 123,
      sender: "Mihail",
      content: message,
      time: "Today...",
      isMine: false,
    };

    socket.emit("send_message" , msg)
    addMessage(msg);
    setMessage("");
  };

  const userTyping = (e: string) => {
    setMessage(e);
  };

  return (
    <div className="border-t p-4 dark:border-gray-800">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-9 w-9 rounded-full"
        >
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach file</span>
        </Button>
        <Input
          value={message}
          onChange={(e) => userTyping(e.target.value)}
          placeholder="Type a message..."
          className="min-h-[2.5rem] flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
            }
          }}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-9 w-9 rounded-full "
        >
          <Smile className="h-5 w-5" />
          <span className="sr-only">Add emoji</span>
        </Button>
        <Button
          type="submit"
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
