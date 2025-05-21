"use client";

import { useEffect, useState } from "react";
import { setActiveChatPage } from "@/utils/store";
import { socket } from "../Socket/Socket";
import { useUser } from "@clerk/nextjs";

type RTCSessionCall = {
  offer: RTCSessionDescriptionInit;
  callee: string;
};
function VideoOverlay() {
  const user = useUser();
  const { activeChat } = setActiveChatPage();
  const [incomingCall, setIncomingCall] = useState<RTCSessionCall | null>(null);

  useEffect(() => {
    socket.on("incoming_call", (offer, callee) => {
      setIncomingCall({ offer, callee });
    });

    return () => {
      socket.off("incoming_call");
    };
  }, []);

  return <div>VideoOverlay</div>;
}
export default VideoOverlay;

async function handleVoiceChat(callerId: string, callee: string) {
  try {
    //Getting media ready for the call
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

    //Establishing connection through a secured ice Server
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peerConnection = new RTCPeerConnection(configuration);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    //Emitting the connection request to the other user
    socket.emit("call_user", {
      callerId: callerId,
      callee: callee,
      offer: offer,
    });
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred, ", error);
  }
}

async function acceptVoiceCall(incomingCall: RTCSessionCall | null) {
  if (!incomingCall) return;

  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(incomingCall.offer)
  );

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit("answer_call", { to: incomingCall.callee, answer });
}

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
