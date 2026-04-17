import { EConversationSocketEvents } from "@/config/socketEvents";
import { Socket } from "socket.io-client";

export const joinConversation = (
  socket: Socket,
  userId: string,
  conversationId: string,
) => {
  socket.emit(
    EConversationSocketEvents.joinConversation,
    userId,
    conversationId,
  );
};

export const leaveConversation = (
  socket: Socket,
  userId: string,
  conversationId: string,
) => {
  socket.emit(
    EConversationSocketEvents.leaveConversation,
    userId,
    conversationId,
  );
};
