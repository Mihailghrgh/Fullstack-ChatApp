import { create } from "zustand";

export type Message = {
  id: string;
  sender: string;
  content: string;
  time: string;
};

type ChatStore = {
  messages: Message[];
  addMessage: (msg: Message) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
}));
