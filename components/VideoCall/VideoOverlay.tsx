"use client";

import { useEffect, useRef, useState } from "react";
import { setActiveChatPage } from "@/utils/store";
import { socket } from "../Socket/Socket";
import { useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Video } from "lucide-react";
import { Mic } from "lucide-react";
import { Phone } from "lucide-react";
import { PhoneOff } from "lucide-react";

type RTCSessionCall = {
  offer: RTCSessionDescriptionInit;
  callee: string;
};

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function VideoOverlay({
  peerConnection,
}: {
  peerConnection: RTCPeerConnection | null;
}) {
  const user = useUser();
  //elements for Audio
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  peerConnectionRef.current = peerConnection;
  //
  const { activeChat } = setActiveChatPage();
  const [incomingCall, setIncomingCall] = useState<RTCSessionCall | null>(null);

  //Attaching Audio listener
  function attachAudio(rtcPeerConnection: RTCPeerConnection) {
    const remoteAudioStream = new MediaStream();

    rtcPeerConnection.ontrack = (event) => {
      remoteAudioStream.addTrack(event.track);

      if (remoteAudioRef.current) {
        console.log("Triggered");

        remoteAudioRef.current.srcObject = remoteAudioStream;
        remoteAudioRef.current
          .play()
          .catch((error) => console.log("Error", error));
      }
    };
  }

  attachAudio(peerConnection);
  //

  useEffect(() => {
    socket.on("incoming_call", (offer, callee) => {
      setIncomingCall({ offer, callee });
    });

    return () => {
      socket.off("incoming_call");
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4">
      <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-lg dark:bg-gray-800">
        <audio autoPlay ref={remoteAudioRef} controls />
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full hover:cursor-pointer"
        >
          <Mic className="h-5 w-5" />
          <span className="sr-only">Toggle Mute</span>
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="rounded-full hover:cursor-pointer"
        >
          <Video className="h-5 w-5" />
          <span className="sr-only">Toggle Video</span>
        </Button>

        <Button
          size="icon"
          variant="destructive"
          className="rounded-full hover:cursor-pointer"
        >
          <Phone className="h-5 w-5" />
          <span className="sr-only">Call</span>
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="rounded-full hover:cursor-pointer"
        >
          <PhoneOff className="h-5 w-5" />
          <span className="sr-only">End Call</span>
        </Button>
      </div>
    </div>
  );
}
export default VideoOverlay;

/////////// STORING FOR REFERENCE ============>
//   useEffect(() => {
//     const allowToUseDevices = async () => {
//       await navigator.mediaDevices.getUserMedia({ audio: true });
//     };

//     const checkDevices = async () => {
//       const devices = await navigator.mediaDevices.enumerateDevices();
//     };

//     allowToUseDevices();
//     checkDevices();
//   }, []);
