import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Maximize2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatContext } from "@/contexts/ChatContext";

export function FloatingChatbot() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, typing, sendMessage } = useChatContext();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  if (location.pathname === "/home/chatbot") return null;

  const send = () => {
    if (!input.trim() || typing) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-[420px] bg-card rounded-2xl shadow-2xl border flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <div className="flex items-center gap-2">
                <img src="/images/ecobot-avatar.webp" alt="EcoBot" className="w-7 h-7 rounded-full object-cover" />
                <span className="font-semibold text-sm">EcoBot</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setOpen(false); navigate("/home/chatbot"); }}
                  className="p-1 hover:bg-white/20 rounded-md transition"
                  title="Expandir"
                >
                  <Maximize2 size={16} />
                </button>
                <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded-md transition">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] px-3 py-2 rounded-xl text-xs",
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  )}>
                    {msg.sender === "user" ? (
                      msg.text
                    ) : (
                      <div className="prose prose-xs prose-green max-w-none [&>p]:mb-0.5 [&>p:last-child]:mb-0">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typing && <div className="text-xs text-emerald-600 animate-pulse">EcoBot está pensando...</div>}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t flex gap-2">
              <Input
                placeholder="Pergunte algo..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                className="rounded-full text-xs h-8"
              />
              <Button
                onClick={send}
                disabled={!input.trim() || typing}
                size="icon"
                className="rounded-full h-8 w-8 bg-gradient-to-r from-green-500 to-emerald-600"
              >
                <Send size={14} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_8px_30px_-4px_rgba(16,185,129,0.5)] flex items-center justify-center hover:shadow-[0_12px_40px_-4px_rgba(16,185,129,0.6)] transition-shadow overflow-hidden"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring" as const, stiffness: 260, damping: 20 }}
        aria-label="Abrir EcoBot"
      >
        <img src="/images/ecobot-avatar.webp" alt="EcoBot" className="w-12 h-12 rounded-full object-cover" />
        {!open && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-400 border-2 border-white animate-pulse" />}
      </motion.button>
    </>
  );
}
