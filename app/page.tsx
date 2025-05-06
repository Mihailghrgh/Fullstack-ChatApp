"use client";

import ChatArea from "@/components/HomePage/ChatArea";
import Sidebar from "@/components/HomePage/Sidebar";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setSidebarOpen(!mobile);
  }, [mobile]);
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-950">
      {sidebarOpen && <Sidebar />}
      <div className="flex flex-1 flex-col">
        <ChatArea />
      </div>
    </div>
  );
}
