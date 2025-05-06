import { create } from "zustand";

type Message = {
  id: number;
  sender: string;
  content: string;
  time: string;
  isMine: boolean;
};

type ChatStore = {
  messages: Message[];
  addMessage: (msg: Message) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
}));
