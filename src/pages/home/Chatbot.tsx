import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RefreshCw, Paperclip } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatContext } from "@/contexts/ChatContext";

export default function EcoChat() {
  const { messages, typing, sendMessage, clearChat } = useChatContext();
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

  const send = () => {
    const text = input;
    if ((!text.trim() && !selectedFile) || typing) return;

    let fileData;
    if (selectedFile) {
      fileData = { name: selectedFile.name, type: selectedFile.type, url: URL.createObjectURL(selectedFile) };
    }

    sendMessage(text, fileData);
    setInput("");
    setSelectedFile(null);
  };

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
              <p className="text-xs opacity-90">{typing ? "Digitando..." : "Online"}</p>
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
                    {isUser ? (
                      msg.text
                    ) : (
                      <div className="prose prose-sm prose-green max-w-none [&>p]:mb-1 [&>p:last-child]:mb-0">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
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
          {typing && <div className="text-sm text-green-600 animate-pulse">EcoBot está pensando...</div>}
          <div ref={bottomRef} />
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
              placeholder="Pergunte qualquer coisa ao EcoBot..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="rounded-full"
            />
            <Button
              onClick={send}
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
