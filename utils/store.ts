import { Socket } from "socket.io-client";
import { create } from "zustand";
import userList from "./userList";

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

type userUsersStore = {
  usersList: Map<string, string>;
  setUserList: (userId: string, socketId: string) => void;
  getUserList: (userId: string) => string | undefined;
  deleteUser: (userId: string) => void;
};

export const useUsersStore = create<userUsersStore>((set, get) => ({
  usersList: new Map(),
  setUserList: (userId, socketId) => {
    set((state) => {
      const updatedList = new Map(state.usersList);
      updatedList.set(userId, socketId);
      return { usersList: updatedList };
    });
  },
  getUserList: (userId) => {
    return get().usersList.get(userId);
  },
  deleteUser: (userId) => {
    set((state) => {
      const updatedList = new Map(state.usersList);
      updatedList.delete(userId);
      return { usersList: updatedList };
    });
  },
}));

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
    return set(() => ({ activeChat: item }));
  },
}));
