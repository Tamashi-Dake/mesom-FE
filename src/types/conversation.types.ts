export interface INewParticipant {
  _id: string;
  username: string;
}

export interface IConversation {
  _id: string;
  name: string;
  avatar: string;
  creator: string;
  isGroup: boolean;
  participants: string[];
  totalMessages: number;
  lastMessage?: string;
  hiddenWith: string[];
}
