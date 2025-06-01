import express from "express";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import cors from "cors";
import userList from "./utils/userList.js";
import axios from "axios";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

const setUserOffline = async (id) => {
  try {
    await axios.post(
      "https://fullstack-chatapp-production.up.railway.app/api/setUserOffline",
      { id }
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error occurred", error);
  }
};

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

    socket.broadcast.emit("update_user_list", userId);

    socket.on("change_user_list", () => {
      console.log("user connected sending event....");
      socket.emit("update_user_list", userId);
    });

    if (!userId) {
      console.log("No userId presented");
    }

    if (userList.has(userId)) {
      console.log(`User ${userId} already connected. Skipping.`);
      return;
    }

    if (userId) {
      userList.set(userId, socket.id);
      console.log("Updated userlist, ", userList);
    }

    /////// Audio Call Socket logic
    socket.on("client_ready", () => {
      console.log("User has connected successfully !");
    });

    socket.on("call_user", ({ to, callee, offer }) => {
      const targetSocketId = userList.get(to);

      const targetCallerId = userList.get(callee);
      if (!targetSocketId) {
        socket.to(targetCallerId).emit("no_answer", "User is offline");
      }
      socket.to(targetSocketId).emit("incoming_call", { offer, callee });
    });

    socket.on("answer_call", ({ to, from, answer }) => {
      const targetSocketId = userList.get(to);
      const targetCallerId = userList.get(from);

      // io.to(targetSocketId).emit("call_answered", answer);
      // io.to(targetCallerId).emit("call_answered", answer);
    });

    socket.on("check_answer", (answer, to) => {
      const targetSocketId = userList.get(to);
      io.to(targetSocketId).emit("checking_answer", answer);
    });

    socket.on("create_ice_candidate", (candidate) => {
      const targetSocketId = userList.get(candidate.to);
      io.to(targetSocketId).emit("ice_candidate", candidate);
    });

    socket.on("set_overlay", (to, from) => {
      const targetSocketId = userList.get(to);
      const targetCallerId = userList.get(from);

      const setOverlay = true;
      io.to(targetSocketId).emit("activate_overlay", setOverlay);
      io.to(targetCallerId).emit("activate_overlay", setOverlay);
    });

    socket.on("end_call_request", (id) => {
      const targetSocketId = userList.get(id);
      io.to(targetSocketId).emit("end_call");
    });

    ////// Message Socket Logic
    socket.on("send_message", ({ to, msg }) => {
      const targetSocketId = userList.get(to);

      if (targetSocketId) {
        socket.to(targetSocketId).emit("received_message", msg);
      } else {
        console.log("Unsuccessful");
      }
    });

    socket.on("user_logout", (id) => {
      setUserOffline(id);
      userList.delete(userId);
      io.emit("update_user_list", id);
    });

    socket.on("disconnect", () => {
      setUserOffline(userId);
      console.log("Client disconnected:", socket.id);
      io.emit("update_user_list", userId);
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
