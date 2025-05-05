import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";

// Dummy data for contacts
const contacts = [
  {
    id: 1,
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Hey, how are you?",
  },
  {
    id: 2,
    name: "James Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Can we meet tomorrow?",
  },
  {
    id: 3,
    name: "Olivia Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Thanks for your help!",
  },
  {
    id: 4,
    name: "Noah Thompson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "I'll send you the files",
  },
  {
    id: 5,
    name: "Sophia Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastMessage: "Let's discuss this later",
  },
];

export default function Sidebar() {
  const { setTheme, theme } = useTheme();

  console.log(theme);

  return (
    <div className="flex h-full w-80 flex-col border-r dark:border-gray-800">
      {/* Header with user info and search */}
      <div className="p-4">
        <Button
          variant="destructive"
          onClick={() =>
            theme === "dark" ? setTheme(() => "light") : setTheme(() => "dark")
          }
        >
          {" "}
          Toggle Theme{" "}
        </Button>
        <h2 className="mb-4 text-xl font-bold">Messages</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search contacts..."
            className="pl-8"
          />
        </div>
      </div>

      {/* Contacts list */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-3 border-b p-4 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-900"
          >
            <div className="relative">
              <Avatar>
                <AvatarImage
                  src={contact.avatar || "/placeholder.svg"}
                  alt={contact.name}
                />
                <AvatarFallback>
                  {contact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {contact.status === "online" && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-950"></span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="font-medium">{contact.name}</p>
                <p className="text-xs text-gray-500">12:34 PM</p>
              </div>
              <p className="truncate text-sm text-gray-500">
                {contact.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
