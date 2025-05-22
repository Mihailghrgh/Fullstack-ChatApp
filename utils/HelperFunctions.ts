import { Socket } from "socket.io-client";

type RTCSessionCall = {
  offer: RTCSessionDescriptionInit;
  callee: string;
};

export async function sendVoiceCall(
  to: string,
  callee: string,
  socket: Socket
) {
  try {
    //Establishing connection through a secured ice Server
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peerConnection = new RTCPeerConnection(configuration);

    //Getting media ready for the call
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    //Emitting the connection request to the other user
    socket.emit("call_user", {
      to: to,
      callee: callee,
      offer: offer,
    });
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred, ", error);
  }
}

export async function acceptVoiceCall(
  incomingCall: RTCSessionDescriptionInit,
  socket: Socket,
  to: string,
  from: string
) {
  if (!incomingCall) return;

  console.log(from);

  try {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(incomingCall)
    );

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("answer_call", { to, from, answer });
  } catch (error: any) {
    console.log(error);
    throw new Error("Error occurred", error);
  }
}
