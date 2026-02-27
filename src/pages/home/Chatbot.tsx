import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
}

const botResponses: Record<string, string> = {
  default: "Ótima pergunta! A sustentabilidade é um tema amplo. Posso te ajudar com temas como energia renovável, reciclagem, mudanças climáticas e conservação ambiental. O que gostaria de saber?",
  energia: "As energias renováveis como solar, eólica e hidrelétrica são fundamentais para reduzir emissões de gases de efeito estufa. O Brasil é líder mundial em energia hidrelétrica! ⚡",
  reciclagem: "A reciclagem reduz a quantidade de lixo nos aterros e economiza recursos naturais. Separe seus resíduos em: papel, plástico, vidro, metal e orgânico. ♻️",
  clima: "As mudanças climáticas são causadas pelo aumento de gases de efeito estufa na atmosfera. Podemos combatê-las reduzindo emissões, plantando árvores e usando energia limpa. 🌡️",
  agua: "A água doce representa apenas 2,5% da água do planeta. Economizar água é essencial: feche a torneira ao escovar os dentes, tome banhos curtos e reutilize água quando possível. 💧",
  desmatamento: "O desmatamento destrói habitats, contribui para mudanças climáticas e reduz a biodiversidade. Apoie organizações de reflorestamento e prefira produtos sustentáveis. 🌳",
};

function getBotReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("energia") || lower.includes("solar") || lower.includes("eólica")) return botResponses.energia;
  if (lower.includes("recicl") || lower.includes("lixo")) return botResponses.reciclagem;
  if (lower.includes("clima") || lower.includes("temperatura") || lower.includes("aquecimento")) return botResponses.clima;
  if (lower.includes("água") || lower.includes("agua")) return botResponses.agua;
  if (lower.includes("desmat") || lower.includes("floresta") || lower.includes("árvore")) return botResponses.desmatamento;
  return botResponses.default;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, sender: "bot", text: "Olá! 🌿 Sou o EcoBot, seu assistente de sustentabilidade. Pergunte-me sobre energia renovável, reciclagem, mudanças climáticas e muito mais!" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "bot", text: getBotReply(text) }]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-full">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">EcoBot</h1>
          <p className="text-xs text-muted-foreground">Assistente de Sustentabilidade</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-3", msg.sender === "user" ? "flex-row-reverse" : "")}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className={cn(
                "text-xs font-bold",
                msg.sender === "bot" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
              )}>
                {msg.sender === "bot" ? <Leaf size={16} /> : <User size={16} />}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-3 text-sm",
                msg.sender === "bot"
                  ? "bg-card border border-border text-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Input
            placeholder="Digite sua pergunta sobre sustentabilidade..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1"
          />
          <Button onClick={send} size="icon">
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
