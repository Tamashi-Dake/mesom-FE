import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "DEVELOPMENT"
    ? import.meta.env.VITE_FRONTEND_URL
    : "/";

export function useSocket(authUser) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!authUser) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    socket.connect();
    socketRef.current = socket;

    socket.on("connect", () => console.log("🔌 Socket connected"));
    socket.on("disconnect", () => console.log("❌ Socket disconnected"));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authUser]);

  return socketRef.current;
}
