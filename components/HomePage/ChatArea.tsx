"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "usehooks-ts";
import { useEffect, useState } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { setActiveChatPage } from "@/utils/store";
import { PhoneCall, Send, PhoneMissed, PhoneIncoming } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { socket } from "../Socket/Socket";
import axios from "axios";
import { Button } from "../ui/button";
import VideoOverlay from "../VideoCall/VideoOverlay";
import { sendVoiceCall } from "@/utils/HelperFunctions";
import { acceptVoiceCall } from "@/utils/HelperFunctions";

type RTCSessionCall = {
  offer: RTCSessionDescriptionInit;
  callee: string;
};

export default function ChatArea() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [callAnswer, setCallAnswer] =
    useState<RTCSessionDescriptionInit | null>(null);
  const [incomingCall, setIncomingCall] = useState<RTCSessionCall | null>(null);

  const mobile = useMediaQuery("(max-width: 768px)");
  const { user } = useUser();
  const { activeChat } = setActiveChatPage();
  console.log(user?.id);

  const setUserOnline = async (id: string) => {
    try {
      await axios.post("/api/setUserOnline", { id });
    } catch (error: any) {
      console.log(error);
      throw new Error("Error occurred", error);
    }
  };

  const setUserOffline = async (id: string) => {
    try {
      await axios.post("/api/setUserOffline", { id });
    } catch (error: any) {
      console.log(error);
      throw new Error("Error occurred", error);
    }
  };

  useEffect(() => {
    if (!socket.connected) {
      socket.auth = { userId: user?.id };
      socket.connect();
      setUserOnline(user?.id as string);
    }

    socket.on("disconnect", () => {
      setUserOffline(user?.id as string);
    });

    return () => {
      console.log("Component unmounted but socket stays alive");
    };
  }, [user?.id]);

  // useEffect for incoming calls
  useEffect(() => {
    socket.on("incoming_call", (offer, callee) => {
      console.log(offer, callee);
      const data = { offer, callee };
      setIncomingCall(data.offer);
    });

    return () => {
      socket.off("incoming_call");
    };
  }, []);

  //useEffect checking incoming call
  useEffect(() => {
    socket.on("call_answered", (answer) => {
      console.log(answer);
      setCallAnswer(answer);
    });

    return () => {
      socket.off("call_answered");
    };
  }, []);

  if (activeChat?.room_id === "none") {
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
        {/* USER DETAILS */}
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src={activeChat?.image} alt="123" />
          </Avatar>

          <div className="ml-3">
            <p className="font-medium">{activeChat?.name}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
        {/* USER CALLING LAYOUT */}
        {incomingCall && (
          <div className="space-x-4">
            <Button
              className="rounded-full bg-green-500 hover:bg-green-600 hover:cursor-pointer"
              onClick={() => {
                acceptVoiceCall(
                  incomingCall.offer,
                  socket,
                  incomingCall.callee,
                  user?.id as string
                );
              }}
            >
              <PhoneIncoming />
              Accept
            </Button>
            <Button className="rounded-full bg-red-500 hover:bg-red-600 hover:cursor-pointer">
              <PhoneMissed />
              Decline
            </Button>
          </div>
        )}
        {/* CALL USER BUTTON*/}
        <Button
          className="rounded-full hover:cursor-pointer"
          onClick={() =>
            sendVoiceCall(activeChat?.id as string, user?.id as string, socket)
          }
        >
          <PhoneCall />
        </Button>

        {/* {sidebarOpen && <MobileSideBar />} */}
      </div>
      {/* Messages or Video Overlay */}
      {callAnswer ? (
        <VideoOverlay />
      ) : (
        <>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
}
