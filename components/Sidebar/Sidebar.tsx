"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon, ArrowBigLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useClerk, useUser } from "@clerk/nextjs";
import { Chat, setActiveChatPage } from "@/utils/store";
import AddNewContact from "./AddNewContact";
import UserStatus from "./UserStatus";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../Socket/Socket";
import { useEffect } from "react";
import { setActiveAudioCall } from "@/utils/store";

type Conversation = {
  createdAt: string;
  id: string;
  room_id: string;
  participants: [
    {
      id: string;
      userDetails: {
        name: string;
        image: string;
      };
    }
  ];
};

export default function Sidebar() {
  const { setTheme, theme } = useTheme();
  const { signOut } = useClerk();
  const { setActivePage } = setActiveChatPage();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { activeAudioChat } = setActiveAudioCall();

  const setUserOnline = async (id: string) => {
    try {
      await axios.post("/api/setUserOnline", { id });
    } catch (error: any) {
      console.log(error);
      throw new Error("Error occurred", error);
    }
  };

  useEffect(() => {
    socket.auth = { userId: user?.id };
    socket.connect();

    socket.on("connect", () => {
      setUserOnline(user?.id as string);
    });
  }, [user?.id]);

  const fetchAllUsers = async () => {
    if (!user?.id) {
      console.log("This is empty ? : ", user?.id);

      return;
    }
    try {
      const { data } = await axios.get("/api/getAllConversations", {
        params: { data: user?.id },
      });
      console.log("Triggered all conversation", data);

      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  };

  const handleSignOut = async () => {
    socket.emit("user_logout", user?.id);
    socket.disconnect();
    await queryClient.cancelQueries();
    queryClient.clear();
    signOut({ redirectUrl: "/sign-in" });
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", user?.id],
    queryFn: fetchAllUsers,
    enabled: !!user?.id,
  });

  if (isLoading) {
    return <div>.............</div>;
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
            type="button"
            className="hover:cursor-pointer"
            onClick={handleSignOut}
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
        {(data || []).map((conversation: Conversation) => {
          return conversation.participants.map((item) => {
            const chat: Chat =
              user?.id !== item.id
                ? {
                    name: item.userDetails.name,
                    image: item.userDetails.image,
                    room_id: conversation.room_id,
                    id: item.id,
                  }
                : null;

            return (
              <div id={item.id} key={item.id}>
                {user?.id !== item.id ? (
                  <div
                    className={`flex items-center gap-3 border p-4 hover:bg-accent hover:cursor-pointer ${
                      item.id === activeAudioChat ? "bg-green-300 text-black hover:bg-green-500" : ""
                    }`}
                    onClick={() => {
                      setActivePage(chat);
                    }}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={item.userDetails.image}
                          alt={item.userDetails.name}
                        />
                      </Avatar>
                      <UserStatus id={item.id} />
                    </div>
                    <h1>{item.userDetails.name.split("@")[0]}</h1>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">12:34 PM</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}
