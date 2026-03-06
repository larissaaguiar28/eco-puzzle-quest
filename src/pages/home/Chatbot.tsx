import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCw, Lightbulb, Info, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatContext } from "@/contexts/ChatContext";

const suggestions = ["Energia renovável", "Reciclagem", "Mudanças climáticas"];

const tips = [
  "💧 Feche a torneira enquanto escova os dentes.",
  "🚲 Prefira caminhar ou usar bicicleta.",
  "🔌 Tire aparelhos da tomada quando não estiver usando.",
  "🛍️ Use sacolas reutilizáveis.",
];

const facts = [
  "🌎 Uma garrafa plástica pode levar até 400 anos para se decompor.",
  "🌳 Uma árvore adulta pode absorver até 22kg de CO₂ por ano.",
  "💡 Lâmpadas LED economizam até 80% de energia.",
  "♻️ Reciclar alumínio economiza 95% de energia.",
];

function Typewriter({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed}</span>;
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === "application/pdf" || file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      alert("Apenas PDF ou imagens são permitidos.");
    }
  };

  const send = (textOverride?: string) => {
    const text = textOverride || input;
    if ((!text.trim() && !selectedFile) || typing) return;

    let fileData;
    if (selectedFile) {
      fileData = { name: selectedFile.name, type: selectedFile.type, url: URL.createObjectURL(selectedFile) };
    }

    sendMessage(text, fileData);
    setInput("");
    setSelectedFile(null);
  };

  const sendTip = () => addBotMessage(tips[Math.floor(Math.random() * tips.length)]);
  const sendFact = () => addBotMessage(facts[Math.floor(Math.random() * facts.length)]);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-emerald-200 via-green-100 to-teal-200 p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
              <img src="/images/ecobot-avatar.webp" alt="EcoBot" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-semibold">EcoBot</h1>
              <p className="text-xs opacity-90">Online</p>
            </div>
          </div>
          <button onClick={clearChat}><RefreshCw size={18} /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex flex-col", isUser ? "items-end" : "items-start")}
                >
                  <div className={cn(
                    "max-w-[70%] px-5 py-3 rounded-2xl text-sm shadow-md",
                    isUser
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border rounded-bl-none"
                  )}>
                    {msg.sender === "bot" ? <Typewriter text={msg.text} /> : msg.text}
                    {msg.file && (
                      <div className="mt-3">
                        {msg.file.type.startsWith("image/") ? (
                          <img src={msg.file.url} alt={msg.file.name} className="rounded-lg max-h-48" />
                        ) : (
                          <a href={msg.file.url} target="_blank" rel="noopener noreferrer" className="underline text-sm">
                            📄 {msg.file.name}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {typing && <div className="text-sm text-green-600">EcoBot está digitando...</div>}
          <div ref={bottomRef} />
        </div>

        {/* Quick actions */}
        <div className="px-6 pb-2 flex gap-2 flex-wrap">
          {suggestions.map((sug) => (
            <button key={sug} onClick={() => send(sug)} className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-full transition">
              {sug}
            </button>
          ))}
          <button onClick={sendTip} className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full flex items-center gap-1">
            <Lightbulb size={14} /> Dica
          </button>
          <button onClick={sendFact} className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1">
            <Info size={14} /> Curiosidade
          </button>
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white/60 backdrop-blur-md">
          {selectedFile && <div className="mb-2 text-sm text-green-700">📎 {selectedFile.name}</div>}
          <div className="flex gap-3">
            <input type="file" accept="application/pdf,image/*" ref={fileInputRef} onChange={handleFile} className="hidden" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="rounded-full">
              <Paperclip size={18} />
            </Button>
            <Input
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="rounded-full"
            />
            <Button
              onClick={() => send()}
              disabled={(!input.trim() && !selectedFile) || typing}
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
