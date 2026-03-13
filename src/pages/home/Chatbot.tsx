"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCw, Paperclip, Zap, Bot, ShieldCheck, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatContext } from "@/contexts/ChatContext";

const suggestions = ["Energia renovável", "Reciclagem", "Mudanças climáticas"];
const tips = ["💧 Feche a torneira ao escovar os dentes.", "🚲 Use bicicleta.", "🔌 Desconecte aparelhos.", "🛍️ Use ecobags."];
const facts = ["🌎 Plástico leva 400 anos para sumir.", "🌳 Árvores absorvem 22kg de CO₂/ano.", "💡 LED economiza 80%."];

function Typewriter({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [text]);
  return <span className="leading-relaxed">{displayed}</span>;
}

export default function EcoChat() {
  const { messages, typing, sendMessage, addBotMessage, clearChat } = useChatContext();
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (textOverride?: string) => {
    const text = textOverride || input;
    if ((!text.trim() && !selectedFile) || typing) return;
    let fileData = selectedFile ? { name: selectedFile.name, type: selectedFile.type, url: URL.createObjectURL(selectedFile) } : undefined;
    sendMessage(text, fileData);
    setInput("");
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#020617] p-4 relative overflow-hidden font-sans">
      
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[130px] rounded-full animate-bounce" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/carbon-fibre.png')` }} />

      <div className="h-6 md:h-12 w-full" />

      {/* --- MAIN CHAT CONTAINER --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl h-[85vh] bg-slate-950/60 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative z-10 ring-1 ring-cyan-400/20"
      >
        
        {/* HEADER */}
        <header className="flex items-center justify-between px-10 py-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl border-2 border-cyan-400/50 p-1 bg-slate-900 rotate-3 group-hover:rotate-0 transition-transform">
                <div className="w-full h-full rounded-xl overflow-hidden bg-cyan-950 flex items-center justify-center">
                   <Bot className="text-cyan-400" size={32} />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-[4px] border-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-2xl text-white tracking-tight flex items-center gap-2">
                  ECO<span className="text-cyan-400">Sustentabilidade</span>
                </h1>
                <span className="bg-cyan-500/10 text-cyan-400 text-[10px] px-2 py-0.5 rounded-full border border-cyan-400/20 font-bold uppercase tracking-widest">v4.0</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <ShieldCheck size={12} className="text-emerald-500/70" />
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">Conexão Segura e Sustentável</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={clearChat} 
            className="group p-4 rounded-2xl bg-slate-900/50 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 border border-white/5 transition-all active:scale-95"
          >
            <RefreshCw size={22} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </header>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn("flex flex-col", isUser ? "items-end" : "items-start")}
                >
                  <div className={cn(
                    "max-w-[75%] px-7 py-5 rounded-[2rem] text-[15px] shadow-xl relative border transition-all",
                    isUser
                      ? "bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-tr-none border-cyan-400/30 shadow-cyan-900/20"
                      : "bg-slate-900/80 text-slate-200 border-white/10 rounded-tl-none backdrop-blur-md"
                  )}>
                    {msg.sender === "bot" ? <Typewriter text={msg.text} /> : msg.text}
                    
                    {msg.file && (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                        {msg.file.type.startsWith("image/") ? (
                          <img src={msg.file.url} alt="upload" className="max-h-64 w-full object-cover hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <a href={msg.file.url} target="_blank" className="flex items-center gap-3 p-4 bg-black/20 text-cyan-400 font-bold uppercase text-xs tracking-tighter">
                            <Paperclip size={18} /> {msg.file.name}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-3 px-2 italic">{msg.time}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {typing && (
            <div className="flex items-center gap-3 text-cyan-400/80">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Processando Conhecimento</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* QUICK ACTIONS */}
        <div className="px-8 py-4 flex gap-3 overflow-x-auto no-scrollbar bg-black/20 border-t border-white/5">
          <button onClick={() => addBotMessage(tips[Math.floor(Math.random() * tips.length)])} className="flex-shrink-0 flex items-center gap-2 text-[10px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 px-5 py-2.5 rounded-full hover:bg-amber-500 hover:text-black transition-all">
            <Sparkles size={14} /> Dica Ecológica
          </button>
          {suggestions.map((sug) => (
            <button key={sug} onClick={() => send(sug)} className="flex-shrink-0 text-[10px] font-black uppercase bg-slate-800/50 text-slate-400 border border-white/5 px-5 py-2.5 rounded-full hover:border-cyan-500 hover:text-cyan-400 transition-all">
              {sug}
            </button>
          ))}
        </div>

        {/* INPUT AREA */}
        <div className="p-8 bg-slate-900/40 backdrop-blur-md border-t border-white/5">
          <div className="flex gap-4 items-center max-w-4xl mx-auto">
            <input type="file" ref={fileInputRef} onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="hidden" />
            
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className={cn("p-4 rounded-2xl border transition-all", selectedFile ? "bg-cyan-500 border-cyan-400 text-black" : "bg-slate-800 border-white/5 text-slate-400 hover:bg-slate-700")}
            >
              <Paperclip size={22} />
            </button>

            <div className="relative flex-1">
              <Input
                placeholder="Pergunte algo sobre o meio ambiente..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                className="h-16 bg-slate-800/50 border-white/5 rounded-[1.25rem] text-white px-8 focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-500 text-base"
              />
              {input && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none opacity-50">
                   <span className="text-[10px] font-bold text-cyan-400 uppercase">Press Enter</span>
                   <Zap size={14} className="text-cyan-400 fill-cyan-400" />
                </div>
              )}
            </div>

            <Button
              onClick={() => send()}
              disabled={(!input.trim() && !selectedFile) || typing}
              className="h-16 w-16 rounded-[1.25rem] bg-cyan-500 hover:bg-white text-black shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all active:scale-90 flex-shrink-0"
            >
              <Send size={24} />
            </Button>
          </div>
          {selectedFile && (
            <p className="text-center text-[10px] font-bold text-cyan-400 mt-4 uppercase tracking-widest">Arquivo pronto para transmissão: {selectedFile.name}</p>
          )}
        </div>
      </motion.div>

      {/* FOOTER */}
      <footer className="mt-8 opacity-30 flex items-center gap-4 group">
        <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-cyan-500" />
        <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.8em] group-hover:tracking-[1em] transition-all duration-1000">EcoNexus Neural Network</span>
        <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-cyan-500" />
      </footer>
    </div>
  );
}