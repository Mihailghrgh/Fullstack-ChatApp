import express from "express";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const nextApp = next({ dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {

  const app = express();

  app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from Express API!" });
  });

  app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
  });

  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", server: "running" });
  });

  const httpServer = createServer(app);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("Connection established with server: ", socket.id);


    socket.emit("welcome", {
      message: "Connected to the server!",
      socketId: socket.id,
    });


    socket.on("message", (data) => {
      console.log("Message received:", data);

      io.emit("newMessage", {
        id: socket.id,
        data: data,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  app.use((req, res) => {
    return nextHandler(req, res);
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
