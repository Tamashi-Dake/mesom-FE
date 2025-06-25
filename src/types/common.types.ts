import { IMessage } from "./message.types";

export interface IAppResponse<T> {
  data?: T;
  success: boolean;
  code: number;
  message?: string;
  title?: string;
}

export interface IMessagePages {
  messages: IMessage[];
  totalItem: number;
  limit: number;
  skip: number;
  nextSkip: number;
  hasMore: boolean;
}
