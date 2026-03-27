import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";


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
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be inside ChatProvider");
  return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: crypto.randomUUID(), sender: "bot", text: "Olá! 🌿 Eu sou o EcoBot. Vamos conversar sobre sustentabilidade?", time: getTime() },
  ]);
  const [typing, setTyping] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const conversationIdRef = useRef<string>(crypto.randomUUID());
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedRef = useRef(false);

  // --- PERSISTENCE: Save conversation directly to DB as JSONB ---
  const saveConversation = useCallback(async (msgs: ChatMessage[]) => {
    if (!user?.id || msgs.length <= 1) return;

    const convId = conversationIdRef.current;
    const storagePath = `${user.id}/${convId}.json`;

    // Strip file blob URLs (not serializable)
    const serializable = msgs.map(({ file, ...rest }) => ({
      ...rest,
      ...(file ? { file: { name: file.name, type: file.type } } : {}),
    }));

    // Upload JSON to storage
    const blob = new Blob([JSON.stringify(serializable, null, 2)], { type: "application/json" });
    
    await supabase.storage
      .from("chatbot")
      .upload(storagePath, blob, { upsert: true })
      .catch(() => null); // Storage upload is best-effort

    // Save to DB table with messages as JSONB
    const { error: dbError } = await supabase
      .from("chatbot_conversations")
      .upsert({
        id: convId,
        user_id: user.id,
        storage_path: storagePath,
        messages: serializable,
        message_count: msgs.length,
        updated_at: new Date().toISOString(),
      } as any, { onConflict: "id" });

    if (dbError) {
      console.error("Failed to save conversation:", dbError);
    }
  }, [user?.id]);

  // Debounced save (2s after last change)
  const debouncedSave = useCallback((msgs: ChatMessage[]) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveConversation(msgs), 2000);
  }, [saveConversation]);

  // --- PERSISTENCE: Load last conversation on mount ---
  useEffect(() => {
    if (!user?.id || loadedRef.current) return;
    loadedRef.current = true;

    (async () => {
      const { data: convRows, error } = await supabase
        .from("chatbot_conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1);

      if (error || !convRows?.length) return;

      const conv = convRows[0] as any;
      conversationIdRef.current = conv.id;

      // Load messages from JSONB column
      if (conv.messages && Array.isArray(conv.messages) && conv.messages.length > 0) {
        setMessages(conv.messages as ChatMessage[]);
      }
    })();
  }, [user?.id]);

  const addBotMessage = useCallback((text: string) => {
    setMessages((prev) => {
      const next = [...prev, { id: crypto.randomUUID(), sender: "bot" as Sender, text, time: getTime() }];
      debouncedSave(next);
      return next;
    });
  }, [debouncedSave]);

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

      if (buffer.trim()) {
        for (let raw of buffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
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
          } catch { /* ignore */ }
        }
      }
    } catch (e: any) {
      if (e.name === "AbortError") return;
      console.error("EcoBot error:", e);
      toast.error(e.message || "Erro ao se comunicar com o EcoBot");
      if (!botText) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId ? { ...m, text: "😔 Desculpe, não consegui responder. Tente novamente." } : m
          )
        );
      }
    } finally {
      setTyping(false);
      abortRef.current = null;
      setMessages((prev) => {
        debouncedSave(prev);
        return prev;
      });
    }
  }, [typing, messages, debouncedSave]);

  const clearChat = useCallback(async () => {
    abortRef.current?.abort();
    await saveConversation(messages);
    conversationIdRef.current = crypto.randomUUID();
    setMessages([{ id: crypto.randomUUID(), sender: "bot", text: "🌿 Conversa reiniciada! Vamos falar sobre sustentabilidade.", time: getTime() }]);
    setTyping(false);
  }, [messages, saveConversation]);

  return (
    <ChatContext.Provider value={{ messages, typing, sendMessage, addBotMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
}
