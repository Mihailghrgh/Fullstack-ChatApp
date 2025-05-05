import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "usehooks-ts";
import { useEffect , useState} from "react";
import MobileSideBar from "./MobileSideBar";
import { messages } from "@/utils/Messages";

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
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
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
      </div>
    </div>
  );
}
