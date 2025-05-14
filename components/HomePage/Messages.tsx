import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message, useChatStore } from "@/utils/store";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { setActiveChatPage } from "@/utils/store";
import axios from "axios";
// import { socket } from "../Socket/Socket";
import { socket } from "./ChatArea";

function Messages() {
  const { messages, addMessage } = useChatStore();
  const { activeChat } = setActiveChatPage();
  const { user } = useUser();
  const newestMessage = useRef<HTMLDivElement>(null);

  const fetchMessage = async () => {
    try {
      const { data } = await axios.get("/api/getMessage", {
        params: { id: activeChat?.id },
      });

      const message: Message = data.map((item) => {
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
        const chat_Id = item.conversation_id;
        const msg: Message = { id, sender, sender_id, content, time, chat_Id };

        addMessage(msg);
      });

      return message;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["message", activeChat?.id],
    queryFn: fetchMessage,
  });

  useEffect(() => {
    socket.on("received_message", (data) => {
      console.log("received message");
      addMessage(data);
    });

    return () => {
      socket.off("received_message");
    };
  }, [socket]);

  useEffect(() => {
    newestMessage.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 ">
      {messages === null ? (
        <h4 className="text-center">No message yet...</h4>
      ) : (
        <div className="space-y-4 ">
          {messages.map((message, i) => (
            <div
              ref={newestMessage}
              key={i}
              className={`flex ${
                user?.id === message.sender_id ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex max-w-[70%]">
                {!user?.fullName && (
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt={message.sender}
                    />
                    <AvatarFallback>
                      {message.sender
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div
                    className={`rounded-lg p-3 ${
                      user?.id === message.sender_id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{message.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Messages;
