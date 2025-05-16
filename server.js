import express from "express";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import cors from "cors";
import userList from "./utils/userList.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();


nextApp.prepare().then(() => {
  const app = express();

  app.use(cors());

  app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
  });

  app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from Express API!" });
  });

  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", server: "running" });
  });

  app.use((req, res) => {
    return nextHandler(req, res);
  });

  const httpServer = createServer(app);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Connection Established......", socket.id);
    const userId = socket.handshake?.auth?.userId;

    if (!userId) {
      console.log("No userId presented");
    }

    if (userList.has(userId)) {
      console.log(`User ${userId} already connected. Skipping.`);
      return;
    }

    if (userId) {
      userList.set(userId, socket.id);
      console.log("Socket and user", userId, " + ", socket.id);
      console.log("Updated userlist, ", userList);
    }

    socket.on("client_ready", () => {
      console.log("User has connected successfully !");
    });

    socket.on("send_message", ({ to, msg }) => {
      const targetSocketId = userList.get(to);

      if (targetSocketId) {
        socket.to(targetSocketId).emit("received_message", msg);
      } else {
        console.log("Unsuccessful");
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      userList.delete(userId);
    });

  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log("> Express and Socket.IO server initialized");
    });
});
