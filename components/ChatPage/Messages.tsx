"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Message, useChatStore } from "@/utils/store";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { setActiveChatPage } from "@/utils/store";
import axios from "axios";
import { socket } from "../Socket/Socket";
import pdf_109 from "../images/pdf_109.webp";
import Image from "next/image";
import WordFile from "../images/WordFile.png";
import { Button } from "../ui/button";

function Messages() {
  const { chats, addMessage, getMessages } = useChatStore();
  const { activeChat } = setActiveChatPage();
  const { user } = useUser();
  const newestMessage = useRef<HTMLDivElement>(null);

  const imageTypes = ["jpg", "jpeg", "png", "webp", "gif"];
  const documentTypesPdf = ["pdf"];
  const documentTypesWord = ["rtf", "docx", "doc", "dotx", "docm", "odt"];

  const downloadPdfFile = async (link: string): Promise<void> => {
    try {
      const response = await fetch(link, {
        headers: {
          Accept: "application/pdf",
        },
      });
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });

      const urlObject = URL.createObjectURL(blob);
      const fileName = link?.split("-").pop() || "document.pdf";

      const hyperLink = document.createElement("a");
      hyperLink.href = urlObject;
      hyperLink.download = fileName.endsWith(".pdf")
        ? fileName
        : `${fileName}.pdf`;
      hyperLink.style.display = "none";

      document.body.appendChild(hyperLink);
      hyperLink.click();
      document.body.removeChild(hyperLink);

      setTimeout(() => URL.revokeObjectURL(urlObject), 1000);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw error;
    }
  };

  const fetchMessage = async () => {
    try {
      const { data } = await axios.get("/api/getMessage", {
        params: { id: activeChat?.room_id },
      });

      const messages = data.map((item: any) => {
        const id = item.id;
        const sender = item.email;
        const sender_id = item.sender_id;
        const content = item.message;
        const time =
          new Date(item.createdAt).toLocaleDateString() +
          " at " +
          new Date(item.createdAt).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          });
        const room_Id = item.room_Id;
        const sender_image = item.sender_image;
        const files = item.files;
        //setting up message Schema to pass to CHATS
        const msg: Message = {
          id,
          sender,
          sender_id,
          content,
          time,
          room_Id,
          sender_image,
          files,
        };

        addMessage(activeChat?.room_id as string, msg);
      });

      return messages;
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading } = useQuery({
    queryKey: ["message", activeChat?.room_id],
    queryFn: fetchMessage,
    staleTime: Infinity,
  });

  useEffect(() => {
    socket.on("received_message", (msg) => {
      console.log("received message", msg?.room_Id, msg?.files);
      addMessage(msg?.room_Id as string, msg);
      newestMessage.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => {
      socket.off("received_message");
    };
  }, [addMessage]);

  useEffect(() => {
    getMessages(activeChat?.room_id as string);
    setTimeout(() => {
      newestMessage.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [activeChat?.room_id, getMessages(activeChat?.room_id as string)]);

  if (isLoading) {
    return <h1>Loading.....</h1>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {chats[activeChat?.room_id as string] === null ? (
        <h4 className="text-center">No message yet...</h4>
      ) : (
        <div className="space-y-4">
          {(chats[activeChat?.room_id as string] || []).map((message, i) => {
            const fileName =
              message.files &&
              (message?.files?.split(".").pop()?.toLowerCase() as string);

            return (
              <div
                ref={newestMessage}
                key={i}
                className={`flex ${
                  user?.id === message?.sender_id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[40%] ${
                    user?.id === message?.sender_id
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <Avatar
                    className={`h-8 w-8 flex-shrink-0 ${
                      user?.id === message?.sender_id ? "ml-2" : "mr-2"
                    }`}
                  >
                    <AvatarImage
                      src={message?.sender_image}
                      alt={message?.sender}
                    />
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`rounded-lg p-3 break-words ${
                        user?.id === message?.sender_id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message?.files &&
                      imageTypes.includes(fileName as string) ? (
                        <img
                          src={message.files}
                          className="max-w-[300px] max-h-[300px] rounded"
                          alt="Shared image"
                        />
                      ) : documentTypesPdf.includes(fileName as string) ? (
                        <div className="flex flex-col items-center justify-center">
                          <Image
                            src={pdf_109}
                            alt={message.id}
                            className="max-w-[100px] max-h-[100px]"
                          />
                          <Button
                            variant={
                              user?.id === message?.sender_id
                                ? "default"
                                : "secondary"
                            }
                            className="hover:cursor-pointer"
                            onClick={() =>
                              downloadPdfFile(message.files as string)
                            }
                          >
                            Download PDF.
                          </Button>
                        </div>
                      ) : documentTypesWord.includes(fileName as string) ? (
                        <div className="flex flex-col items-center">
                          <Image
                            src={WordFile}
                            alt={message.id}
                            className="max-w-[100px] max-h-[100px]"
                          />
                          <a
                            className="underline text-sm"
                            href={message?.files as string}
                            download
                          >
                            {message.files
                              ?.split("-")
                              .pop()
                              ?.slice(0, 10)
                              .concat("...doc")}
                          </a>
                        </div>
                      ) : null}

                      {message?.content && (
                        <div className="whitespace-pre-wrap">
                          <p className="break-words">{message?.content}</p>
                        </div>
                      )}
                    </div>
                    <p
                      className={`mt-1 text-xs text-gray-500 ${
                        user?.id === message?.sender_id
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {message?.time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default Messages;
