import React from "react";
import { Outlet } from "react-router-dom";
import { HomeSidebar } from "@/components/home/HomeSidebar";
import { FloatingChatbot } from "@/components/home/FloatingChatbot";

export default function HomeLayout() {
  return (
    <div className="flex w-full min-h-screen bg-background">
      <HomeSidebar />
      <main className="flex-1 ml-[260px] transition-all duration-300">
        <Outlet />
      </main>
      <FloatingChatbot />
    </div>
  );
}
