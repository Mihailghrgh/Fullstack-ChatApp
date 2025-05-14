import { create } from "zustand";

export type Message = {
  id: string;
  sender: string;
  sender_id: string;
  content: string;
  time: string;
  chat_Id: string;
};

type ChatStore = {
  chats: Record<string, Message[]>;
  addMessage: (userId: string, msg: Message) => void;
  getMessages: (userId: string) => void;
};

export type Chat = {
  name: string;
  image: string;
  room_Id: string;
  id: string;
} | null;

type ActivePageStore = {
  activeChat: Chat;
  setActivePage: (item1: Chat) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: {},
  addMessage: (userId: string, msg: Message) => {
    const prev = get().chats[userId] || [];
    set({ chats: { ...get().chats, [userId]: [...prev, msg] } });
  },
  getMessages: (userId: string) => get().chats[userId] || [],
}));

export const setActiveChatPage = create<ActivePageStore>((set) => ({
  activeChat: { name: "none", image: "none", room_Id: "none", id: "none" },
  setActivePage: (item: Chat) => set(() => ({ activeChat: item })),
}));
