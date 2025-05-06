import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "usehooks-ts";
import { useEffect, useState } from "react";
import MobileSideBar from "./MobileSideBar";
import Messages from "./Messages";
import MessageInput from "./MessageInput";


export default function ChatArea() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setSidebarOpen(mobile);
  }, [mobile]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Chat header */}
      <div className="flex justify-between border-b p-4 dark:border-gray-800">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="/placeholder.svg?height=40&width=40"
              alt="Emma Wilson"
            />
            <AvatarFallback>EW</AvatarFallback>
          </Avatar>

          <div className="ml-3">
            <p className="font-medium">Emma Wilson</p>
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
