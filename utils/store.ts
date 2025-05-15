import { create } from "zustand";

export type Message = {
  id: string;
  sender: string;
  sender_id: string;
  content: string;
  time: string;
  room_Id: string;
  sender_image: string;
};

type ChatStore = {
  chats: Record<string, Message[]>;
  addMessage: (userId: string, msg: Message) => void;
  getMessages: (userId: string) => void;
};

export type Chat = {
  name: string;
  image: string;
  room_id: string;
  id: string;
} | null;

type ActivePageStore = {
  activeChat: Chat;
  setActivePage: (item1: Chat) => void;
};

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: {},
  addMessage: (roomId: string, msg: Message) => {
    const prev = get().chats[roomId] || [];
    set({ chats: { ...get().chats, [roomId]: [...prev, msg] } });
  },
  getMessages: (roomId: string) => {
    return get().chats[roomId] || [];
  },
}));

export const setActiveChatPage = create<ActivePageStore>((set) => ({
  activeChat: { name: "none", image: "none", room_id: "none", id: "none" },
  setActivePage: (item: Chat) => {
    console.log("Setting item as : ", item);

    return set(() => ({ activeChat: item }));
  },
}));
