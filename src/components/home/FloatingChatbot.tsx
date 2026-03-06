import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export function FloatingChatbot() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/home/chatbot") return null;

  return (
    <motion.button
      onClick={() => navigate("/home/chatbot")}
      className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_8px_30px_-4px_rgba(16,185,129,0.5)] flex items-center justify-center hover:shadow-[0_12px_40px_-4px_rgba(16,185,129,0.6)] transition-shadow"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring" as const, stiffness: 260, damping: 20 }}
      aria-label="Abrir EcoBot"
      title="EcoBot"
    >
      <Bot size={28} strokeWidth={2.5} />
      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-400 border-2 border-white animate-pulse" />
    </motion.button>
  );
}
