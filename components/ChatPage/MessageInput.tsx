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
  const messageRef = useRef<string>("");
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { addMessage } = useChatStore();
  const { user } = useUser();
  const { activeChat } = setActiveChatPage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileToUpload, setFileToUpload] = useState<File>();

  const form = document.getElementById("messageForm") as HTMLFormElement;

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    const emailAddress = user?.primaryEmailAddress?.emailAddress;

    const msg: Message = {
      id: user?.id as string,
      sender: user?.fullName ?? (emailAddress?.toUpperCase() as string),
      sender_id: user?.id as string,
      sender_image: user?.imageUrl as string,
      content: messageRef.current,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      room_Id: activeChat?.room_id as string,
      files: fileType ? fileType : "",
    };
    //formatting the message for backend
    if (fileToUpload) {
      formData.append("file", fileToUpload as File);
    }
    formData.append("message", JSON.stringify(msg));
    //sending and returning the sent message as it might contain an image, doc, etc
    const { data } = await axios.post("/api/sendMessage", formData);
    console.log(data);

    msg.files = data;
    //emitting message to other chat
    addMessage(activeChat?.room_id as string, msg);
    socket.emit("send_message", { to: activeChat?.id, msg: msg });
    setFileType("");
    setFileName("");
    setFileToUpload(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if(submitButtonRef.current){
      submitButtonRef.current.disabled = true
    }

    form.reset();
  };

  //For the Future
  const userTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    messageRef.current = currentValue;

    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = currentValue.length === 0;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileToUpload(file);

    if (file && submitButtonRef.current) {
      submitButtonRef.current.disabled = false;

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
    } else if (!file && submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
      setFileName("");
    }
  };

  const handleRemoveFile = () => {
    setFileType("");
    setFileName("");
    setFileToUpload(undefined);

    if (submitButtonRef.current && messageRef.current.length === 0) {
      submitButtonRef.current.disabled = true;
    }
  };

  return (
    <div className="border-t p-4 ">
      {/* FILE COMPONENT */}
      <div className={`${fileName ? "block" : "hidden"} flex flex-col text-center items-center justify-center w-full max-w-sm mx-auto mb-4 space-y-2 text-sm py-0 relative`} >
        <MessageFilePreview fileName={fileName} fileType={fileType} />
        <Button
          type="reset"
          variant="ghost"
          size="sm"
          onClick={handleRemoveFile}
          className="p-0 rounded-md  hover:cursor-pointer"
        >
          <h1 className="">Remove file</h1>
          <X className="h-3 w-3" />
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2"
        id="messageForm"
      >
        <Button
          type="button"
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
            id="file"
            hidden
            onChange={handleFileUpload}
            className="w-1xl"
          />
          <Paperclip className="h-5 w-5" />
        </Button>

        <Input
          id="message"
          type="text"
          onChange={(e) => userTyping(e)}
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
          ref={submitButtonRef}
          disabled
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
