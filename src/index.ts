// tslint:disable:no-console
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get("/", (req, res) => {
  res.send("Hello world!");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", message);
  });
});

// start the Express server
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
