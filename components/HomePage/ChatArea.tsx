"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "usehooks-ts";
import { useEffect, useRef, useState } from "react";
import Messages from "./Messages";
import MessageInput from "./MessageInput";
import { setActiveChatPage } from "@/utils/store";
import { PhoneCall, Send, PhoneMissed, PhoneIncoming } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { socket } from "../Socket/Socket";
import { Button } from "../ui/button";
import VideoOverlay from "../VideoCall/VideoOverlay";
import { sendVoiceCall } from "@/utils/HelperFunctions";
import { acceptVoiceCall } from "@/utils/HelperFunctions";
import { setRemoteDescription } from "@/utils/HelperFunctions";
import { setActiveAudioCall } from "@/utils/store";

type RTCSessionCall = {
  offer: RTCSessionDescriptionInit;
  callee: string;
};

export default function ChatArea() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [audiOverlay, setAudioOverlay] = useState<boolean>(false);
  ////////Rtc Peer Connection
  const [callAnswer, setCallAnswer] =
    useState<RTCSessionDescriptionInit | null>(null);
  const [incomingCall, setIncomingCall] = useState<RTCSessionCall | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const { activeAudioChat, setActiveAudioChat } = setActiveAudioCall();
  ////////Rtc Peer Connection
  const mobile = useMediaQuery("(max-width: 768px)");
  const { user } = useUser();
  const { activeChat } = setActiveChatPage();

  // useEffect for incoming calls
  useEffect(() => {
    socket.on("incoming_call", (offer, callee) => {
      const data = { offer, callee };
      setIncomingCall(data.offer);
    });

    return () => {
      socket.off("incoming_call");
    };
  }, []);

  //useEffect checking answered call
  useEffect(() => {
    socket.on("call_answered", (answer) => {
      setCallAnswer(answer);
    });

    return () => {
      socket.off("call_answered");
    };
  }, []);

  //useEffect to activate the call
  useEffect(() => {
    socket.on("checking_answer", async (answer) => {
      await setRemoteDescription(peerConnectionRef, answer);
    });

    return () => {
      socket.off("checking_answer");
    };
  }, []);

  //useEffect to create ICE-candidate
  useEffect(() => {
    socket.on("ice_candidate", (candidate) => {
      peerConnectionRef.current
        ?.addIceCandidate(new RTCIceCandidate(candidate.candidate))
        .catch((err) => console.log(err));
    });

    return () => {
      socket.off("ice_candidate");
    };
  }, []);

  useEffect(() => {
    socket.on("activate_overlay", (data) => {
      setAudioOverlay(data);
      setActiveAudioChat(activeChat?.id as string);
      setIncomingCall(null);
    });

    return () => {
      socket.off("activate_overlay");
    };
  }, [activeChat?.id, setActiveAudioChat]);

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
        {callAnswer === null ? (
          incomingCall && (
            <div className="space-x-4">
              <Button
                className="rounded-full bg-green-500 hover:bg-green-600 hover:cursor-pointer"
                onClick={() => {
                  acceptVoiceCall(
                    peerConnectionRef,
                    remoteAudioRef,
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
          )
        ) : (
          <></>
        )}
        {/* CALL USER BUTTON*/}
        <Button
          className="rounded-full hover:cursor-pointer"
          onClick={() => {
            sendVoiceCall(
              peerConnectionRef,
              remoteAudioRef,
              activeChat?.id as string,
              user?.id as string,
              socket
            );
          }}
        >
          <PhoneCall />
        </Button>

        {/* {sidebarOpen && <MobileSideBar />} */}
      </div>
      {/* Messages or Video Overlay */}
      {activeChat?.id === activeAudioChat ? (
        <VideoOverlay
          remoteAudioRef={remoteAudioRef}
          peerConnectionRef={peerConnectionRef}
        />
      ) : (
        <>
          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
}
