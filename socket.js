// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Set up Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Basic Socket.IO connection
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Optional: health check route for Render
app.get("/", (req, res) => {
  res.send("Socket.IO server is up!");
});

// Start the server
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
