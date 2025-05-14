import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "usehooks-ts";
import { useEffect, useState } from "react";
import MobileSideBar from "../Sidebar/MobileSideBar";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { setActiveChatPage } from "@/utils/store";
import { Send } from "lucide-react";
import { useUser } from "@clerk/nextjs";
// import { initializeSocket , socket} from "../Socket/Socket";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
export let socket: Socket;

export default function ChatArea() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mobile = useMediaQuery("(max-width: 768px)");
  const { user } = useUser();

  const { activeChat } = setActiveChatPage();
  useEffect(() => {
    setSidebarOpen(mobile);

    socket = io({
      auth: { userId: user?.id },
    });
    // initializeSocket(user?.id as string);

    // return () => {

    //   if(socket){
    //     socket.disconnect()
    //   }
    // }
  }, [mobile]);

  if (activeChat?.name === "none") {
    return (
      <div className="flex-1 flex items-center justify-center flex-col p-4 text-center">
        <div className="mb-4 p-6 bg-muted rounded-full">
          <Send className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">Your Messages</h3>
        <p className="text-muted-foreground max-w-md">
          Select a contact to start messaging
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Chat header */}
      <div className="flex justify-between border-b p-4 dark:border-gray-800">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={activeChat?.image} alt="123" />
          </Avatar>

          <div className="ml-3">
            <p className="font-medium">{activeChat?.name}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
        {sidebarOpen && <MobileSideBar />}
      </div>

      {/* Messages */}
      <Messages />
      <MessageInput />
    </div>
  );
}
