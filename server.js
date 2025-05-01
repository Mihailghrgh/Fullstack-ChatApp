import express from "express";
import next from "next";
import http from "http";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  const server = http.createServer(expressApp);
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("connected", socket.id);

    socket.on("chat", (msg) => {
      io.emit("chat", msg);
    });
  });

  expressApp.all("*", (req, res) => handle(req, res));

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
