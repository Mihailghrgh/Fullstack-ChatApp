"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon, ArrowBigLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useClerk } from "@clerk/nextjs";
import { Users } from "@prisma/client";
import { setActiveChatPage } from "@/utils/store";
import AddNewContact from "./AddNewContact";

export default function Sidebar() {
  const { setTheme, theme } = useTheme();
  const { signOut } = useClerk();
  const { setActivePage } = setActiveChatPage();

  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.get("/api/getAllConversations");
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  if (isLoading) {
    console.log("Loading...");
    return <div>Loading....</div>;
  }

  if (isError) {
    console.log(error);
    return <div>Error....</div>;
  }

  return (
    <div className="flex h-full w-80 flex-col border-r dark:border-gray-800">
      {/* Header with user info and search */}
      <div className="p-4">
        <div className="flex justify-between">
          <Button
            variant="secondary"
            className="hover:cursor-pointer"
            onClick={() => {
              signOut({ redirectUrl: "/sign-in" });
            }}
          >
            <ArrowBigLeft />
          </Button>
          <Button
            variant="destructive"
            className="hover:cursor-pointer"
            onClick={() =>
              theme === "dark"
                ? setTheme(() => "light")
                : setTheme(() => "dark")
            }
          >
            {theme === "light" ? <Sun /> : <Moon />}
          </Button>
          <AddNewContact />
        </div>
      </div>

      {/* Contacts list */}
      <div className="flex-1 overflow-y-auto">
        {data.map((conversation) => (
          <div
            onClick={() => {
              setActivePage(conversation.name);
            }}
            key={conversation.id}
            className="flex items-center gap-3 border-b p-4 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-900"
          >
            <div className="relative">
              <Avatar>
                <AvatarImage
                  src={conversation.image || "/placeholder.svg"}
                  alt={conversation.name}
                />
                <AvatarFallback>
                  {conversation.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="font-medium">{conversation.name}</p>
                <p className="text-xs text-gray-500">12:34 PM</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
