"use client";
import mammoth from "mammoth";
import type React from "react";
import { useState } from "react";
import { Paperclip, Send, Smile, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { useChatStore } from "@/utils/store";
import { useUser } from "@clerk/nextjs";
import { Message } from "@/utils/store";
import axios from "axios";
import { setActiveChatPage } from "@/utils/store";
import { socket } from "../Socket/Socket";
import { useRef } from "react";
import MessageFilePreview from "./MessageFilePreview";

export default function MessageInput() {
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [message, setMessage] = useState("");
  const { addMessage } = useChatStore();
  const { user } = useUser();
  const { activeChat } = setActiveChatPage();
  const inputRef = useRef<HTMLInputElement>(null);

  async function convertDocument(file: File) {
    try {
      const arrayBuffer = await file.arrayBuffer();

      const result = await mammoth.convertToHtml({ arrayBuffer });

      return {
        html: result.value,
        messages: result.messages,
      };
    } catch (error) {
      console.error("Mammoth conversion failed:", error);
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailAddress = user?.primaryEmailAddress?.emailAddress;

    const msg: Message = {
      id: user?.id as string,
      sender: user?.fullName ?? (emailAddress?.toUpperCase() as string),
      sender_id: user?.id as string,
      sender_image: user?.imageUrl as string,
      content: message,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      room_Id: activeChat?.room_id as string,
    };

    await axios.post("/api/sendMessage", { message: msg });
    addMessage(activeChat?.room_id as string, msg);
    socket.emit("send_message", { to: activeChat?.id, msg: msg });
    setMessage("");
  };

  const userTyping = (e: string) => {
    setMessage(e);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
        const result = await convertDocument(file);

        if (result) {
          setFileType(result.html);
          setFileName(file.name);
        }
      } else {
        setFileName(file.name);
        setFileType(file ? URL.createObjectURL(file) : "");
      }
    } else {
      setFileName("");
    }
  };

  const handleRemoveFile = () => {
    setFileName("");
  };

  return (
    <div className="border-t p-4 ">
      {fileName && (
        <div className="flex flex-col text-center items-center justify-center w-full max-w-sm mx-auto mb-4 space-y-2 text-sm py-0 relative">
          <MessageFilePreview fileName={fileName} fileType={fileType} />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            className="p-0 rounded-md  hover:cursor-pointer"
          >
            <h1 className="">Remove file</h1>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <Button
          type="reset"
          size="icon"
          id="file"
          variant="ghost"
          className="h-9 w-9 rounded-full hover:cursor-pointer"
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          <Input
            type="file"
            ref={inputRef}
            hidden
            onChange={handleFileUpload}
            className="w-1xl"
          />
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
              // handleSubmit(e);
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
