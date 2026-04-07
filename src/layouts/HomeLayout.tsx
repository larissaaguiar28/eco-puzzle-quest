import React from "react";
import { Outlet } from "react-router-dom";
import { HomeSidebar } from "@/components/home/HomeSidebar";
import { FloatingChatbot } from "@/components/home/FloatingChatbot";
import { ChatProvider } from "@/contexts/ChatContext";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";

export default function HomeLayout() {
  return (
    <ChatProvider>
      <div className="flex w-full min-h-screen bg-background">
        <HomeSidebar />
        <main className="flex-1 ml-[84px] transition-all duration-300">
          <Outlet />
        </main>
        <FloatingChatbot />
        <AccessibilityMenu />
      </div>
    </ChatProvider>
  );
}
