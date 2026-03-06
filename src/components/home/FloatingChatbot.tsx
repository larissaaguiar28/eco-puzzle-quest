import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Maximize2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Sender = "user" | "bot";

interface Message {
  id: string;
  sender: Sender;
  text: string;
}

const responses: Record<string, string> = {
  energia: "⚡ Energia solar e eólica reduzem CO₂ e ajudam o planeta 🌎",
  reciclagem: "♻️ Separar o lixo preserva recursos naturais!",
  clima: "🌡️ Mudanças climáticas vêm do excesso de gases estufa.",
  default: "🌿 Sustentabilidade: cuidar do presente sem prejudicar o futuro.",
};

const getReply = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes("energia")) return responses.energia;
  if (lower.includes("recicl")) return responses.reciclagem;
  if (lower.includes("clima")) return responses.clima;
  return responses.default;
};

export function FloatingChatbot() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "bot", text: "Olá! 🌿 Eu sou o EcoBot. Como posso ajudar?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  if (location.pathname === "/home/chatbot") return null;

  const send = () => {
    if (!input.trim() || typing) return;
    const text = input;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "bot", text: getReply(text) }]);
      setTyping(false);
    }, 600);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-[420px] bg-card rounded-2xl shadow-2xl border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <div className="flex items-center gap-2">
                <Bot size={20} />
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
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-md transition"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.sender === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] px-3 py-2 rounded-xl text-xs",
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && <div className="text-xs text-emerald-600">EcoBot está digitando...</div>}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t flex gap-2">
              <Input
                placeholder="Digite..."
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

      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
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
        {!open && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-400 border-2 border-white animate-pulse" />}
      </motion.button>
    </>
  );
}
