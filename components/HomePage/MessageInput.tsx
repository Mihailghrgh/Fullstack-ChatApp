"use client";

import type React from "react";

import { useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function MessageInput() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
      // Here you would typically send the message to your backend
    }
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
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
        <Button type="submit" size="icon" className="h-9 w-9 rounded-full">
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
