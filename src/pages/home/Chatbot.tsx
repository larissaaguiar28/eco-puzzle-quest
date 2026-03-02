import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Leaf, ThumbsUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Sender = "user" | "bot";

interface Message {
  id: string;
  sender: Sender;
  text: string;
  liked?: boolean;
  time: string;
}

const suggestions = ["Energia renovável", "Reciclagem", "Mudanças climáticas"];

const responses: Record<string, string> = {
  energia: "⚡ Energia solar e eólica reduzem CO₂ e ajudam o planeta.",
  reciclagem: "♻️ Separar lixo corretamente preserva recursos naturais.",
  clima: "🌡️ Mudanças climáticas são causadas pelo efeito estufa.",
  default:
    "🌿 Sustentabilidade é essencial para o futuro do planeta.",
};

const getReply = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes("energia")) return responses.energia;
  if (lower.includes("recicl")) return responses.reciclagem;
  if (lower.includes("clima")) return responses.clima;
  return responses.default;
};

function Typewriter({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}</span>;
}

export default function EcoChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      sender: "bot",
      text: "Olá! 🌿 Sou o EcoBot. Como posso ajudar?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim() || typing) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "bot",
          text: getReply(text),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setTyping(false);
    }, 1000);
  };

  const toggleLike = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, liked: !msg.liked } : msg
      )
    );
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-emerald-200 via-green-100 to-teal-200 p-4 animate-pulse-slow">
      <div className="w-full max-w-4xl h-[90vh] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <div className="flex items-center gap-3">
            <Leaf />
            <div>
              <h1 className="font-semibold">EcoBot</h1>
              <p className="text-xs opacity-80 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-ping"></span>
                Online
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => {
              const isUser = msg.sender === "user";

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex flex-col", isUser ? "items-end" : "items-start")}
                >
                  <div
                    className={cn(
                      "group relative max-w-[70%] px-5 py-3 rounded-2xl text-sm shadow-md transition hover:scale-[1.02]",
                      isUser
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border rounded-bl-none"
                    )}
                  >
                    {msg.sender === "bot" ? (
                      <Typewriter text={msg.text} />
                    ) : (
                      msg.text
                    )}

                    {!isUser && (
                      <button
                        onClick={() => toggleLike(msg.id)}
                        className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 transition"
                      >
                        <ThumbsUp
                          size={16}
                          className={msg.liked ? "text-green-600" : "text-gray-400"}
                        />
                      </button>
                    )}
                  </div>

                  <span className="text-xs text-gray-400 mt-1">
                    {msg.time}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {typing && (
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150" />
              <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-300" />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Sugestões rápidas */}
        <div className="px-6 pb-2 flex gap-2 flex-wrap">
          {suggestions.map((sug) => (
            <button
              key={sug}
              onClick={() => send(sug)}
              className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-full transition"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white/60 backdrop-blur-md">
          <div className="flex gap-3">
            <Input
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="rounded-full"
            />
            <Button
              onClick={() => send()}
              disabled={!input.trim() || typing}
              className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}