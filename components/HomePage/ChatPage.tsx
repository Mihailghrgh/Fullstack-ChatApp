"use client";

import ChatArea from "@/components/HomePage/ChatArea";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { setActiveChatPage } from "@/utils/store";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mobile = useMediaQuery("(max-width: 768px)");
  

  useEffect(() => {
    setSidebarOpen(!mobile);
  }, [mobile]);

  const checkUser = async () => {
    try {
      const data = await axios.post("/api/createUser");

      return data;
    } catch (error: any) {
      console.log("Error details:", error);
    }
  };

  const { isLoading, isError, error } = useQuery({
    queryKey: ["createUser"],
    queryFn: checkUser,
  });

  if (isLoading) {
    return <h1>Loading....</h1>;
  }

  if (isError) {
    console.log(error);
    return <h3>ERROR....</h3>;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-950">
      {sidebarOpen && <Sidebar />}
      <div className="flex flex-1 flex-col">
        <ChatArea />
      </div>
    </div>
  );
}
