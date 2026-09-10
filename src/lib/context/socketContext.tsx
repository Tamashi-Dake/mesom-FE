import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { EUserSocketEvents } from "@/enums";
import toast from "react-hot-toast";
import { useCurrentUser } from "./authContext";
import { config } from "@/constants";

const BACKEND_URL =
 config.env.VITE_ENV === "development"
    ? config.env.VITE_BACKEND_URL
    : "/";

const SocketContext = createContext<Socket | null>(null);

interface IProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: IProps) => {
  const { currentUser } = useCurrentUser();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const socket = io(BACKEND_URL, {
      query: { userId: currentUser._id },
    });

    setSocket(socket);

    socket.on("connect", () => console.log("🔌 Socket connected"));
    socket.on("disconnect", () => console.log("❌ Socket disconnected"));

    socket.emit(
      EUserSocketEvents.setup,
      currentUser._id,
      currentUser.displayName,
    );
    socket.on(EUserSocketEvents.online, (displayName) => {
      toast.success(`Hello ${displayName}`);
    });

    return () => {
      socket.disconnect();
      setSocket(null);
    };
  }, [currentUser]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export function useSocket() {
  const context = useContext(SocketContext);

  if (context === undefined)
    throw new Error("useSocket must be used within an SocketProvider");

  return context;
}
