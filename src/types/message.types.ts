export interface IMessage {
  _id: string;
  conversation: string;
  sender: IMessageSender;
  text?: string;
  images?: string[];
  type: string;
  replyTo?: string;
  isDeleted: boolean;
  isSeen: boolean;
  reactions?: IMessageReaction[];
  createdAt: string;
  updatedAt?: string;
}
export interface IMessageSender {
  profile: {
    avatarImg: string;
  };
  _id: string;
  displayName?: string;
  username: string;
}

export interface IMessageReaction {
  user: string;
  reactions: string[];
}
