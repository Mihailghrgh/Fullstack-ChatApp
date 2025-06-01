"use client";
import { Socket } from "socket.io-client";

export const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
///////////////////////////////////////////////////////////////////////
export async function sendVoiceCall(
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
  remoteAudioRef: React.MutableRefObject<HTMLAudioElement | null>,
  to: string,
  callee: string,
  socket: Socket
) {
  try {
    //Getting media ready for the call
    // if (!peerConnectionRef.current) {
    //   console.log("Peer Connection empty", peerConnectionRef);
    //   return;
    // }

    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const iceCandidate = {
          candidate: event.candidate,
          to: to,
        };
        socket.emit("create_ice_candidate", iceCandidate);
      }
    };

    //Recording audio track
    peerConnection.ontrack = (event) => {
      const remoteAudio = new Audio();
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.autoplay = true;
      remoteAudio.play().catch((e) => console.error("Playback error", e));

      remoteAudioRef.current = remoteAudio;
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    //Emitting the connection request to the other user
    peerConnectionRef.current = peerConnection;

    socket.emit("call_user", {
      to: to,
      callee: callee,
      offer: offer,
    });
  } catch (error: any) {
    console.log(error);
    throw new Error("An error occurred, ", error);
  }
}

///////////////////////////////////////////////////////////////////////
export async function acceptVoiceCall(
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
  remoteAudioRef: React.MutableRefObject<HTMLAudioElement | null>,
  incomingCall: RTCSessionDescriptionInit,
  socket: Socket,
  to: string,
  from: string
) {
  if (!incomingCall) return;

  try {
    //Getting media ready for the call
    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const iceCandidate = {
          candidate: event.candidate,
          to: to,
        };
        socket.emit("create_ice_candidate", iceCandidate);
      }
    };

    // Recording audio track
    peerConnection.ontrack = (event) => {
      const remoteAudio = new Audio();
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.autoplay = true;
      remoteAudio.play().catch((e) => console.error("Playback error", e));

      remoteAudioRef.current = remoteAudio;
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(incomingCall)
    );
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    peerConnectionRef.current = peerConnection;

    socket.emit("check_answer", answer, to);

    socket.emit("set_overlay", to, from);
  } catch (error: any) {
    console.log(error);
    throw new Error("Error occurred", error);
  }
}

// export async function handleVoiceCallAnswer(
//   peerConnection: RTCPeerConnection,
//   answer: RTCSessionDescriptionInit,
//   pendingCandidates: RTCIceCandidateInit[]
// ) {
//   try {
//     // Only set remote answer if the signaling state is correct
//     if (peerConnection.signalingState === "stable") {
//       await peerConnection.setRemoteDescription(
//         new RTCSessionDescription(answer)
//       );

//       // Apply buffered ICE candidates
//       pendingCandidates.forEach((candidate) => {
//         peerConnection
//           .addIceCandidate(new RTCIceCandidate(candidate))
//           .catch((err) => console.log(err));
//       });
//       pendingCandidates.length = 0; // Clear buffer
//     } else {
//       console.warn(
//         "Skipping setRemoteDescription: wrong signaling state",
//         peerConnection.signalingState
//       );
//     }
//   } catch (error) {
//     console.log("handleVoiceCallAnswer error:", error);
//     throw new Error("Failed to set remote answer");
//   }
// }
///////////////////////////////////////////////////////////////////////
export async function setRemoteDescription(
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
  answer: RTCSessionDescriptionInit
) {
  if (peerConnectionRef?.current?.signalingState !== "have-local-offer") {
    console.warn(
      "Skipping setRemoteDescription because signalingState is",
      peerConnectionRef?.current?.signalingState
    );
    return;
  }
  try {
    await peerConnectionRef?.current?.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
    console.log("Remote description set with answer successfully.");
  } catch (err) {
    console.error("Failed to set remote description:", err);
  }
}

export async function setIceCandidate(
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>,
  socket: Socket,
  id: string
) {
  console.log(peerConnectionRef);

  if (!peerConnectionRef.current) {
    console.log("Peer Connection empty", peerConnectionRef);
    return;
  }

  peerConnectionRef.current.onicecandidate = (event) => {
    console.log("creating ice candidate");

    if (event.candidate) {
      const iceCandidate = {
        candidate: event.candidate,
        to: id,
      };
      socket.emit("create_ice_candidate", iceCandidate);
    }
  };
}

// function setUpIceCandidate(
//   peerConnection: RTCPeerConnection,
//   socket: Socket,
//   to: string
// ) {
//   try {
//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("ice_candidate", (event.candidate, to));
//       }
//     };
//   } catch (error: any) {
//     console.log(error);
//     throw new Error(error);
//   }

//   return peerConnection;
// }
