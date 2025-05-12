import { create } from "zustand";

export type Message = {
  id: string;
  sender: string;
  sender_id: string, 
  content: string;
  time: string;
  chat_Id: string;
};

type ChatStore = {
  messages: Message[];
  addMessage: (msg: Message) => void;
};

export type Chat = {
  name: string;
  image: string;
  room_Id: string;
  id: string;
};

type ActivePageStore = {
  activeChat: Chat;
  setActivePage: (item1: Chat) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
}));

export const setActiveChatPage = create<ActivePageStore>((set) => ({
  activeChat: { name: "none", image: "none", room_Id: "none", id: "none" },
  setActivePage: (item: Chat) => set(() => ({ activeChat: item })),
}));
