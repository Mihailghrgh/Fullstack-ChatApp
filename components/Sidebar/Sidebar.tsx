"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon, ArrowBigLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useClerk } from "@clerk/nextjs";
import { Chat, setActiveChatPage } from "@/utils/store";
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
        {data.map((conversation) => {
          return conversation.map((item) => {

            const data: Chat = {
              name: item.name,
              image: item.image,
              id: item.id,
              room_Id: item.room_id,
            };

            return (
              <div
                id={item.id}
                key={item.id}
                className="flex items-center gap-3 border-b p-4 hover:bg-accent hover:cursor-pointer"
                onClick={() => {
                  setActivePage(data);
                }}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={item.image} alt={item.name} />
                  </Avatar>
                </div>
                <h1>{item.name.split("@")[0]}</h1>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">12:34 PM</p>
                  </div>
                </div>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
