import { Socket } from "socket.io-client";

type RTCSessionCall = {
  offer: RTCSessionDescriptionInit;
  callee: string;
};

export async function sendVoiceCall(
  peerConnection: RTCPeerConnection,
  to: string,
  callee: string,
  socket: Socket
) {
  try {
    //Establishing connection through a secured ice Server
    //Getting media ready for the call
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    //creating the ICE-candidate first before sending the offer details
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", {
          candidate: event.candidate,
          to: to,
        });
      }
    };
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
  peerConnection: RTCPeerConnection,
  incomingCall: RTCSessionDescriptionInit,
  socket: Socket,
  to: string,
  from: string
) {
  if (!incomingCall) return;

  try {
    //Establishing connection through a secured ice Server
    //Getting media ready for the call
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(incomingCall)
    );

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    //Emitting the answer request to the other user

    //creating the ICE-candidate first before sending the offer details
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", {
          candidate: event.candidate,
          to: from,
        });
      }
    };
    socket.emit("answer_call", { to, from, answer });
  } catch (error: any) {
    console.log(error);
    throw new Error("Error occurred", error);
  }
}

function setUpIceCandidate(
  peerConnection: RTCPeerConnection,
  socket: Socket,
  to: string
) {
  try {
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", (event.candidate, to));
      }
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }

  return peerConnection;
}
