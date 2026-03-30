import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react"; // Adicionado useEffect aqui
import { toast } from "sonner";

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

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

interface ChatContextType {
  messages: ChatMessage[];
  typing: boolean;
  sendMessage: (text: string, file?: ChatMessage["file"]) => void;
  addBotMessage: (text: string) => void;
  clearChat: () => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be inside ChatProvider");
  return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // 1. Iniciamos vazio para não conflitar com o carregamento do banco
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const abortRef = useRef<AbortController | null>(null); // Garantido que o ref existe

  // 2. Só coloca a saudação se o chat continuar vazio após carregar
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ 
        id: crypto.randomUUID(), 
        sender: "bot", 
        text: "Olá! 🌿 Eu sou o EcoBot. Vamos conversar sobre sustentabilidade?", 
        time: getTime() 
      }]);
    }
  }, [messages.length]);

  const addBotMessage = useCallback((text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "bot", text, time: getTime() }]);
  }, []);

  const sendMessage = useCallback(async (text: string, file?: ChatMessage["file"]) => {
    if ((!text.trim() && !file) || typing) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), sender: "user", text, time: getTime(), file };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    const history = messages
      .filter((m) => m.text.trim())
      .map((m) => ({ role: m.sender === "user" ? "user" as const : "assistant" as const, content: m.text }));
    history.push({ role: "user", content: text });

    const botId = crypto.randomUUID();
    let botText = "";

    try {
      abortRef.current = new AbortController();
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
        throw new Error(err.error || `Erro ${resp.status}`);
      }

      if (!resp.body) throw new Error("Sem resposta do servidor");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      setMessages((prev) => [...prev, { id: botId, sender: "bot", text: "", time: getTime() }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              botText += content;
              const captured = botText;
              setMessages((prev) =>
                prev.map((m) => (m.id === botId ? { ...m, text: captured } : m))
              );
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      if (e.name === "AbortError") return;
      console.error("EcoBot error:", e);
      toast.error(e.message || "Erro ao se comunicar com o EcoBot");
      if (!botText) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId ? { ...m, text: "😔 Desculpe, não consegui responder." } : m
          )
        );
      }
    } finally {
      setTyping(false);
      abortRef.current = null;
    }
  }, [typing, messages]);

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([{ id: crypto.randomUUID(), sender: "bot", text: "🌿 Conversa reiniciada!", time: getTime() }]);
    setTyping(false);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, typing, sendMessage, addBotMessage, clearChat, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
}