import { EUserSocketEvents } from "@/enums";
import { IUser } from "@/types";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BACKEND_URL
    : "/";

export function useSocket(authUser: IUser) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!authUser) return;
    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    socket.connect();
    socketRef.current = socket;

    socket.on("connect", () => console.log("🔌 Socket connected"));
    socket.on("disconnect", () => console.log("❌ Socket disconnected"));

    socket.emit(EUserSocketEvents.setup, authUser._id, authUser.displayName);

    socket.on(EUserSocketEvents.online, (displayName) => {
      // TODO - Normal: Need to add some usecase when user online, currently don't know what to do if user is online or not
      toast.success(`Hello ${displayName}`);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authUser]);

  return socketRef.current;
}
