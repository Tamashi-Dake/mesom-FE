import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useCurrentUser } from "./authProvider";

const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BACKEND_URL
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
      withCredentials: true,
    });

    setSocket(socket);

    socket.on("connect", () => console.log("Socket connected"));
    socket.on("disconnect", () => console.log("Socket disconnected"));
    socket.on("connect_error", (err) =>
      console.error("Socket connect error:", err.message),
    );

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
