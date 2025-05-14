import { io, Socket } from "socket.io-client";

export let socket: Socket;

export const initializeSocket = (userId: string) => {
  if (!socket) {
    socket = io({
      auth: { userId },
    });
  }
};
