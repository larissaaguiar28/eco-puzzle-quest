"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCw, Paperclip, Zap, Bot, ShieldCheck, Sparkles, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatContext } from "@/contexts/ChatContext";
import supabase from "../../../utils/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { useToast, Toast } from "../../components/ecomessage";

const suggestions = ["Energia renovável", "Reciclagem", "Mudanças climáticas"];
const tips = ["💧 Feche a torneira ao escovar os dentes.", "🚲 Use bicicleta.", "🔌 Desconecte aparelhos.", "🛍️ Use ecobags."];

export default function EcoChat() {
  // 1. Puxamos as funções do Contexto
  const { messages, typing, sendMessage, addBotMessage, clearChat, setMessages } = useChatContext();
  const [input, setInput] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user } = useAuth();
  const { message, showToast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);



  useEffect(() => {
  if (user) {
    loadChatFromStorage();
  }
}, [user]);

useEffect(() => {
  // Se estiver carregando (true), ele sai da função e não faz NADA no banco.
  if (isInitialLoad) return; 

  if (user && messages.length > 1 && !typing) {
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage.text && lastMessage.text.trim() !== "") {
       handleEcoChat(messages);
    }
  }
}, [messages, user, isInitialLoad, typing]);


async function loadChatFromStorage() {
  if (!user) return;
  try {
    setIsInitialLoad(true); // TRAVA ATIVADA
    
    const { data, error } = await supabase
      .from("chatbot")
      .select("file_url")
      .eq("user_id", user.id)
      .single();

    if (error || !data?.file_url) {
      setIsInitialLoad(false);
      return;
    }

    const response = await fetch(data.file_url);
    const history = await response.json();
    
    if (history && history.length > 0) {
      // Pega apenas as últimas 10 ou 15 para garantir performance
      const lastMessages = history.slice(-15);
      
      setMessages(lastMessages); 
      console.log("Histórico enviado para o Contexto!");
    }
  } catch (err) {
    console.error("Erro:", err);
  } finally {
    // AQUI ESTÁ O SEGREDO: 
    // Espera 2 segundos antes de dizer que o carregamento inicial acabou.
    // Isso impede que o 'useEffect' de salvar sobrescreva o que você acabou de puxar.
    setTimeout(() => {
      setIsInitialLoad(false);
      console.log("Sistema pronto para novos salvamentos.");
    }, 2000);
  }
}
  

  async function handleEcoChat(updatedChat: any[]) {
    if (!user) return;
    try {
      const publicUrl = await uploadChatHistory(user.id, updatedChat);
      
      const { error } = await supabase
        .from("chatbot")
        .upsert({
          user_id: user.id,
          message: updatedChat,
          file_url: publicUrl
        }, { onConflict: 'user_id' });

      if (error) throw error;
      console.log("Chat sincronizado no Banco e Storage!");
    } catch (error: any) {
      console.error("Erro na sincronização:", error);
    }
  }

  async function uploadChatHistory(userId: string, history: any[]) {
    const fileName = `chat_${userId}.json`;
    const fileContent = JSON.stringify(history, null, 2);
    const file = new Blob([fileContent], { type: "application/json" });

    const { error } = await supabase.storage
      .from("chat-files")
      .upload(`${userId}/${fileName}`, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from("chat-files").getPublicUrl(`${userId}/${fileName}`);
    return data.publicUrl;
  }

  // --- LOGICA C: INTERFACE E ENVIO ---
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      setSelectedFile(file);
    } else if (file) {
      alert("Apenas PDF ou imagens são permitidos.");
    }
  };

  const send = (textOverride?: string) => {
  const text = textOverride || input;
  if ((!text.trim() && !selectedFile) || typing) return;

  // Se o usuário está mandando mensagem, com certeza não estamos mais "restaurando"
  setIsInitialLoad(false); 

  let fileData;
    if (selectedFile) {
      fileData = { 
        name: selectedFile.name, 
        type: selectedFile.type, 
        url: URL.createObjectURL(selectedFile) 
      };
    }

    sendMessage(text, fileData);
    setInput("");
    setSelectedFile(null);
  };

  return (
    <>
      <Toast message={message} />
      <div className="min-h-screen flex flex-col items-center bg-[#020617] p-4 relative overflow-hidden font-sans">
        
        {/* BACKGROUND */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[130px] rounded-full animate-bounce" style={{ animationDuration: '8s' }} />

        <div className="h-6 md:h-12 w-full" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-5xl h-[85vh] bg-slate-950/60 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden relative z-10"
        >
          {/* HEADER */}
          <header className="flex items-center justify-between px-10 py-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl border-2 border-cyan-400/50 p-1 bg-slate-900">
                <div className="w-full h-full rounded-xl overflow-hidden bg-cyan-950 flex items-center justify-center">
                   <Bot className="text-cyan-400" size={32} />
                </div>
              </div>
              <div>
                <h1 className="font-black text-2xl text-white tracking-tight">ECO<span className="text-cyan-400">Bot</span></h1>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">Interface Online</p>
              </div>
            </div>
            <button onClick={clearChat} className="p-4 rounded-2xl bg-slate-900/50 text-slate-400 hover:text-cyan-400 border border-white/5 transition-all">
              <RefreshCw size={22} />
            </button>
          </header>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {messages.map((msg: any) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex flex-col", msg.sender === "user" ? "items-end" : "items-start")}>
                  <div className={cn(
                    "max-w-[80%] px-7 py-5 rounded-[2rem] text-[15px] shadow-xl border transition-all", 
                    msg.sender === "user" ? "bg-cyan-600 text-white rounded-tr-none border-cyan-400/30" : "bg-slate-900/80 text-slate-200 border-white/10 rounded-tl-none"
                  )}>
                    {/* Colocamos as classes prose aqui na div pai ou em uma div dedicada */}
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                    {msg.file && (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                        {msg.file.type.startsWith("image/") ? (
                          <img src={msg.file.url} alt="upload" className="max-h-64 w-full object-cover" />
                        ) : (
                          <a href={msg.file.url} target="_blank" className="flex items-center gap-3 p-4 text-cyan-400"><FileText size={20} /> <span className="text-xs font-bold uppercase truncate">{msg.file.name}</span></a>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-3 px-2">{msg.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {typing && <div className="text-cyan-400 text-[10px] font-black uppercase animate-pulse">EcoBot analisando...</div>}
            <div ref={bottomRef} />
          </div>

          {/* INPUT AREA */}
          <div className="p-8 bg-slate-900/40 backdrop-blur-md border-t border-white/5">
            <div className="flex gap-4 items-center max-w-4xl mx-auto">
              <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className={cn("p-4 rounded-2xl border transition-all", selectedFile ? "bg-cyan-500 text-black" : "bg-slate-800 text-slate-400")}>
                <Paperclip size={22} />
              </button>
              <div className="relative flex-1">
                <Input
                  placeholder="Pergunte algo..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  className="h-16 bg-slate-800/50 border-white/5 rounded-[1.25rem] text-white px-8"
                />
              </div>
              <Button onClick={() => send()} className="h-16 w-16 rounded-[1.25rem] bg-cyan-500 text-black transition-all active:scale-90">
                <Send size={24} />
              </Button>
            </div>
          </div>
        </motion.div>

        <footer className="mt-8 opacity-30 flex items-center gap-4 group">
          <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.8em]">EcoBot Interface</span>
        </footer>
      </div>
    </>
  );
}