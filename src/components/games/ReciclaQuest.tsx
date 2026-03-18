import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Recycle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onExit: () => void;
  onXP: (amount: number) => void;
}

interface FallingItem {
  id: number;
  type: "metal" | "plastic" | "paper" | "glass";
  emoji: string;
  x: number;
  y: number;
  speed: number;
}

const BINS = [
  { type: "metal", label: "Metal", color: "bg-yellow-500", emoji: "🟡" },
  { type: "plastic", label: "Plástico", color: "bg-red-500", emoji: "🔴" },
  { type: "paper", label: "Papel", color: "bg-blue-500", emoji: "🔵" },
  { type: "glass", label: "Vidro", color: "bg-green-500", emoji: "🟢" },
];

const ITEMS: { type: FallingItem["type"]; emoji: string; name: string }[] = [
  { type: "metal", emoji: "🥫", name: "Latinha" },
  { type: "metal", emoji: "🔩", name: "Parafuso" },
  { type: "plastic", emoji: "🧴", name: "Frasco" },
  { type: "plastic", emoji: "🥤", name: "Copo" },
  { type: "paper", emoji: "📰", name: "Jornal" },
  { type: "paper", emoji: "📦", name: "Caixa" },
  { type: "glass", emoji: "🍾", name: "Garrafa" },
  { type: "glass", emoji: "🫙", name: "Pote" },
];

export default function ReciclaQuest({ onExit, onXP }: Props) {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [selected, setSelected] = useState<FallingItem | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; id: number } | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(60);
  const nextId = useRef(0);

  // Spawn items
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const template = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      const item: FallingItem = {
        id: nextId.current++,
        type: template.type,
        emoji: template.emoji,
        x: 10 + Math.random() * 70,
        y: -5,
        speed: 0.3 + Math.random() * 0.3,
      };
      setItems((prev) => [...prev.slice(-12), item]);
    }, 1400);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Fall animation
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setItems((prev) => {
        const next: FallingItem[] = [];
        let newMisses = 0;
        for (const item of prev) {
          if (item.y >= 85) {
            newMisses++;
          } else {
            next.push({ ...item, y: item.y + item.speed * 2 });
          }
        }
        if (newMisses > 0) setMisses((m) => m + newMisses);
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Timer
  useEffect(() => {
    if (gameOver) return;
    const t = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [gameOver]);

  // End on too many misses
  useEffect(() => {
    if (misses >= 10) setGameOver(true);
  }, [misses]);

  const handleDropOnBin = (binType: string) => {
    if (!selected) return;
    const correct = selected.type === binType;
    setFeedback({ correct, id: selected.id });
    if (correct) {
      setScore((s) => s + 1);
      onXP(10);
      setItems((prev) => prev.filter((i) => i.id !== selected.id));
    }
    setSelected(null);
    setTimeout(() => setFeedback(null), 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-4 md:p-8 text-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onExit} className="text-slate-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Sair da Missão
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-cyan-400 font-bold">⏱ {timer}s</span>
            <span className="text-emerald-400 font-bold">✅ {score}</span>
            <span className="text-red-400 font-bold">❌ {misses}/10</span>
          </div>
        </div>

        <h2 className="text-3xl font-black text-center mb-2">
          <Recycle className="inline mr-2 text-cyan-400" /> Recicla Quest
        </h2>
        <p className="text-slate-400 text-center mb-6 text-sm">
          Toque no resíduo e depois na lixeira correta!
        </p>

        {gameOver ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16"
          >
            <h3 className="text-4xl font-black mb-4">🏁 Fim de Jogo!</h3>
            <p className="text-2xl text-cyan-400 font-bold mb-2">{score} itens reciclados</p>
            <p className="text-emerald-400 font-bold mb-8">+{score * 10} XP ganhos!</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => { setScore(0); setMisses(0); setTimer(60); setItems([]); setGameOver(false); }} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">
                Jogar Novamente
              </Button>
              <Button variant="outline" onClick={onExit} className="border-slate-600">
                Voltar ao Menu
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Game area */}
            <div className="relative bg-slate-800/50 rounded-3xl border border-slate-700/50 h-[400px] overflow-hidden mb-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: selected?.id === item.id ? 1.3 : 1,
                      top: `${item.y}%`,
                      left: `${item.x}%`,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={() => setSelected(item)}
                    className={`absolute text-3xl cursor-pointer transition-all ${
                      selected?.id === item.id ? "ring-4 ring-cyan-400 rounded-xl bg-cyan-500/20 p-1" : ""
                    }`}
                    style={{ transform: "translate(-50%, -50%)" }}
                  >
                    {item.emoji}
                  </motion.button>
                ))}
              </AnimatePresence>

              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                  >
                    {feedback.correct ? (
                      <Check className="h-20 w-20 text-emerald-400" />
                    ) : (
                      <X className="h-20 w-20 text-red-400" />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bins */}
            <div className="grid grid-cols-4 gap-3">
              {BINS.map((bin) => (
                <motion.button
                  key={bin.type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDropOnBin(bin.type)}
                  className={`${bin.color} rounded-2xl p-4 text-center font-bold text-white shadow-lg transition-all ${
                    selected ? "ring-2 ring-white/30 animate-pulse" : ""
                  }`}
                >
                  <span className="text-2xl block mb-1">{bin.emoji}</span>
                  <span className="text-xs uppercase tracking-wider">{bin.label}</span>
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
