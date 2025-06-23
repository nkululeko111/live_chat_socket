import { io } from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
let socketInstance = null;

export const initSocket = () => {
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  socketInstance = io(API_URL, {
    withCredentials: true, // Keep credentials enabled
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ["websocket", "polling"],
  });

  // Connection events
  socketInstance.on("connect", () => {
    console.log("✅ Socket connected:", socketInstance.id);
  });

  socketInstance.on("connect_error", (err) => {
    console.error("❌ Connection error:", err.message);
    setTimeout(() => {
      if (!socketInstance.connected) {
        socketInstance.connect();
      }
    }, 5000);
  });

  socketInstance.on("disconnect", (reason) => {
    console.warn("⚠️ Disconnected:", reason);
    if (reason === "io server disconnect") {
      socketInstance.connect();
    }
  });

  return socketInstance;
};

export const getSocket = () => {
  if (!socketInstance) {
    throw new Error("Socket not initialized. Call initSocket() first.");
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export const isSocketConnected = () => {
  return socketInstance?.connected || false;
};
