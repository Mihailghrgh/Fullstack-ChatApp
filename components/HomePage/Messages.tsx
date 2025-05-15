import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Message, useChatStore } from "@/utils/store";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { setActiveChatPage } from "@/utils/store";
import axios from "axios";
import { socket } from "../Socket/Socket";

function Messages() {
  const { chats, addMessage, getMessages } = useChatStore();
  const { activeChat } = setActiveChatPage();
  const { user } = useUser();
  const newestMessage = useRef<HTMLDivElement>(null);

  const fetchMessage = async () => {
    try {
      const { data } = await axios.get("/api/getMessage", {
        params: { id: activeChat?.room_id },
      });

      const messages = data.map((item) => {
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
        const msg: Message = {
          id,
          sender,
          sender_id,
          content,
          time,
          room_Id,
          sender_image,
        };

        addMessage(activeChat?.room_id as string, msg);
      });

      return messages;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["message", activeChat?.room_id],
    queryFn: fetchMessage,
    staleTime: Infinity,
  });

  useEffect(() => {
    socket.on("received_message", (msg) => {
      console.log("received message", msg?.room_Id);
      addMessage(msg?.room_Id as string, msg);
      newestMessage.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => {
      socket.off("received_message");
    };
  }, []);

  useEffect(() => {
    const data = getMessages(activeChat?.room_id as string);

    console.log("Data here to understand", data);

    setTimeout(() => {
      newestMessage.current?.scrollIntoView({ behavior: "smooth" });
    }, 30);
  }, [
    activeChat?.room_id,
    data?.length,
    getMessages(activeChat?.room_id as string).length,
  ]);

  return (
    <div className="flex-1 overflow-y-auto p-4 ">
      {chats[activeChat?.room_id as string] === null ? (
        <h4 className="text-center">No message yet...</h4>
      ) : (
        <div className="space-y-4 ">
          {(chats[activeChat?.room_id as string] || []).map((message, i) => {
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
                <div className="flex max-w-[70%]">
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage
                      src={message?.sender_image}
                      alt={message?.sender}
                    />
                  </Avatar>

                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        user?.id === message?.sender_id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p>{message?.content}</p>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
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
