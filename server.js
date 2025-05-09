import express from "express";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import cors from "cors";

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

    socket.on("send_message", (data) => {
      console.log(data);
      socket.broadcast.emit("received_message", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
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
