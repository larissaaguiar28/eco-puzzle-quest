import React, { createContext, useContext, useState, useCallback } from "react";

export type Sender = "user" | "bot";

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  time: string;
  file?: { name: string; type: string; url: string };
}

const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const responses: Record<string, string> = {
  energia: "⚡ Ótima escolha! Energia solar e eólica reduzem CO₂ e ajudam muito o planeta 🌎",
  reciclagem: "♻️ Separar o lixo corretamente preserva recursos naturais e reduz a poluição!",
  clima: "🌡️ As mudanças climáticas acontecem por causa do excesso de gases do efeito estufa.",
  default: "🌿 Sustentabilidade significa cuidar do presente sem prejudicar o futuro.",
};

const getReply = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes("energia")) return responses.energia;
  if (lower.includes("recicl")) return responses.reciclagem;
  if (lower.includes("clima")) return responses.clima;
  return responses.default;
};

interface ChatContextType {
  messages: ChatMessage[];
  typing: boolean;
  sendMessage: (text: string, file?: ChatMessage["file"]) => void;
  addBotMessage: (text: string) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be inside ChatProvider");
  return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: crypto.randomUUID(), sender: "bot", text: "Olá! 🌿 Eu sou o EcoBot. Vamos conversar sobre sustentabilidade?", time: getTime() },
  ]);
  const [typing, setTyping] = useState(false);

  const addBotMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "bot", text, time: getTime() }]);
  }, []);

  const sendMessage = useCallback((text: string, file?: ChatMessage["file"]) => {
    if ((!text.trim() && !file) || typing) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "user", text, time: getTime(), file }]);
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "bot", text: getReply(text), time: getTime() }]);
      setTyping(false);
    }, 800);
  }, [typing]);

  const clearChat = useCallback(() => {
    setMessages([{ id: crypto.randomUUID(), sender: "bot", text: "🌿 Conversa reiniciada! Vamos falar sobre sustentabilidade.", time: getTime() }]);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, typing, sendMessage, addBotMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
}
