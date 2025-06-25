import { Socket } from "socket.io-client";

export const registerUserEvents = (
  socket: Socket,
  setState: (arg0: any) => void,
) => {
  socket.on("user:joined", (data) => setState((prev) => [...prev, data]));
  socket.on("user:left", (data) =>
    setState((prev) => prev.filter((u) => u.id !== data.id)),
  );
};
