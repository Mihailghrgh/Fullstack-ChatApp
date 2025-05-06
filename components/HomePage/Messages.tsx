import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/utils/store";
import { useEffect } from "react";
import { io } from "socket.io-client";

function Messages() {
  const { messages, addMessage } = useChatStore();
  console.log(messages);
  const socket = io();

  useEffect(() => {
    socket.on("received_message", (data) => {
      console.log("Data sent: ", data);
      addMessage(data);
    });

    return () => {
      socket.off("received_message");
    };
  }, [socket]);

  return (
    <div className="flex-1 overflow-y-auto p-4 ">
      {messages === null ? (
        <h4 className="text-center">No message yet...</h4>
      ) : (
        <div className="space-y-4 ">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex max-w-[70%]">
                {!message.isMine && (
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
                      message.isMine
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
