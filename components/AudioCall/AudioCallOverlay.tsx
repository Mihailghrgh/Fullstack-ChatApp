"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "../Socket/Socket";
import { useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Ghost, Video } from "lucide-react";
import { Mic, MicOff } from "lucide-react";
import { Phone } from "lucide-react";
import { PhoneOff } from "lucide-react";
import { setActiveAudioCall } from "@/utils/store";
import { setActiveChatPage } from "@/utils/store";

type AudioProps = {
  remoteAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>;
};

function VideoOverlay({ peerConnectionRef, remoteAudioRef }: AudioProps) {
  const user = useUser();
  //elements for Audio
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mic, setMic] = useState<boolean>(true);
  const { activeAudioChat, setActiveAudioChat } = setActiveAudioCall();
  const { activeChat } = setActiveChatPage();
  function toggleMic() {
    try {
      const audioEl = remoteAudioRef.current;
      if (!audioEl) {
        console.warn("Audio element ref is null.");
        return;
      }

      const stream = remoteAudioRef.current?.srcObject as MediaStream;
      stream
        .getAudioTracks()
        .forEach((audio) => (audio.enabled = !audio.enabled));

      setMic((prev) => !prev);
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  }

  useEffect(() => {
    socket.on("end_call", () => {
      peerConnectionRef.current?.close();
      remoteAudioRef.current = null;
      setActiveAudioChat("none");
    });

    return () => {
      socket.off("end_call");
    };
  }, []);

  function endCall() {
    try {
      socket.emit("end_call_request", activeChat?.id);
      peerConnectionRef.current?.close();
      remoteAudioRef.current = null;
      setActiveAudioChat("none");
    } catch (error) {
      console.log(error);
      throw new Error(error as string);
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4">
      <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-lg dark:bg-gray-800">
        <audio autoPlay ref={audioRef} />
        <Button
          size="icon"
          variant={mic ? "ghost" : "destructive"}
          className="rounded-full hover:cursor-pointer"
          onClick={toggleMic}
        >
          {mic ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5  " />}

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
          onClick={endCall}
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
