import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Dummy data for messages
const messages = [
  {
    id: 1,
    sender: "Emma Wilson",
    content: "Hey there! How's it going?",
    time: "12:30 PM",
    isMine: false,
  },
  {
    id: 2,
    sender: "You",
    content: "Hi Emma! I'm doing well, thanks for asking. How about you?",
    time: "12:32 PM",
    isMine: true,
  },
  {
    id: 3,
    sender: "Emma Wilson",
    content: "I'm great! Just working on that project we discussed last week.",
    time: "12:33 PM",
    isMine: false,
  },
  {
    id: 4,
    sender: "You",
    content: "Oh nice! How's the progress so far?",
    time: "12:34 PM",
    isMine: true,
  },
  {
    id: 5,
    sender: "Emma Wilson",
    content:
      "It's coming along well. I've completed the first phase and now moving to the second part. Would you like to see what I've done so far?",
    time: "12:36 PM",
    isMine: false,
  },
];

export default function ChatArea() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center border-b p-4 dark:border-gray-800">
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
