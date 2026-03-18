import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onExit: () => void;
  onXP: (amount: number) => void;
}

interface FallingObject {
  id: number;
  x: number;
  y: number;
  type: "trash" | "animal";
  emoji: string;
  speed: number;
}

const TRASH = ["🥤", "🛍️", "🧴", "📦", "🥡", "🪣"];
const ANIMALS = ["🐟", "🐢", "🐠", "🦈", "🐙", "🦀"];

export default function OceanoLimpo({ onExit, onXP }: Props) {
  const [playerX, setPlayerX] = useState(50);
  const [objects, setObjects] = useState<FallingObject[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [cleanPercent, setCleanPercent] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(90);
  const nextId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse / touch movement
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(5, Math.min(95, pct)));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleMove]);

  // Spawn objects
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const isTrash = Math.random() > 0.3;
      const pool = isTrash ? TRASH : ANIMALS;
      setObjects((prev) => [
        ...prev.slice(-15),
        {
          id: nextId.current++,
          x: 5 + Math.random() * 90,
          y: -5,
          type: isTrash ? "trash" : "animal",
          emoji: pool[Math.floor(Math.random() * pool.length)],
          speed: 0.4 + Math.random() * 0.4,
        },
      ]);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Fall + collision
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setObjects((prev) => {
        const next: FallingObject[] = [];
        for (const obj of prev) {
          const newY = obj.y + obj.speed * 2;
          // Check collision with player (bottom area)
          if (newY >= 80 && newY <= 95 && Math.abs(obj.x - playerX) < 10) {
            if (obj.type === "trash") {
              setScore((s) => s + 1);
              setCleanPercent((p) => Math.min(100, p + 2));
              onXP(5);
            } else {
              setLives((l) => l - 1);
            }
            continue; // collected/hit
          }
          if (newY > 105) continue; // fell off
          next.push({ ...obj, y: newY });
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [gameOver, playerX, onXP]);

  // Timer
  useEffect(() => {
    if (gameOver) return;
    const t = setInterval(() => setTimer((p) => { if (p <= 1) { setGameOver(true); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, [gameOver]);

  useEffect(() => { if (lives <= 0) setGameOver(true); }, [lives]);

  const waterOpacity = 1 - cleanPercent / 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-900 via-blue-950 to-slate-950 p-4 md:p-8 text-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onExit} className="text-slate-300 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Sair da Missão
          </Button>
          <div className="flex items-center gap-4 text-sm font-bold">
            <span className="text-cyan-400">⏱ {timer}s</span>
            <span className="text-emerald-400">🗑 {score}</span>
            <span className="text-red-400">❤️ {lives}</span>
          </div>
        </div>

        <h2 className="text-3xl font-black text-center mb-2">
          <Waves className="inline mr-2 text-cyan-400" /> Oceano Limpo
        </h2>
        <p className="text-cyan-300/60 text-center mb-2 text-sm">Mova o mouse para coletar lixo. Desvie dos animais!</p>

        {/* Clean bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
            animate={{ width: `${cleanPercent}%` }}
          />
        </div>

        {gameOver ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16">
            <h3 className="text-4xl font-black mb-4">🌊 Missão Concluída!</h3>
            <p className="text-2xl text-cyan-400 font-bold mb-2">{score} lixos removidos</p>
            <p className="text-lg text-emerald-400 mb-1">Oceano {cleanPercent}% limpo</p>
            <p className="text-emerald-400 font-bold mb-8">+{score * 5} XP ganhos!</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => { setScore(0); setLives(3); setCleanPercent(0); setTimer(90); setObjects([]); setGameOver(false); }} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold">
                Jogar Novamente
              </Button>
              <Button variant="outline" onClick={onExit} className="border-slate-600">Voltar ao Menu</Button>
            </div>
          </motion.div>
        ) : (
          <div
            ref={containerRef}
            className="relative rounded-3xl border border-cyan-500/20 h-[420px] overflow-hidden cursor-none"
            style={{
              background: `linear-gradient(to bottom, rgba(8,145,178,${0.1 + waterOpacity * 0.3}), rgba(15,23,42,0.9))`,
            }}
          >
            {/* Bubbles decoration */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400/20 rounded-full"
                animate={{ y: [400, -20], x: [0, Math.sin(i) * 20] }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
                style={{ left: `${10 + i * 15}%` }}
              />
            ))}

            <AnimatePresence>
              {objects.map((obj) => (
                <motion.div
                  key={obj.id}
                  className="absolute text-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, top: `${obj.y}%`, left: `${obj.x}%` }}
                  exit={{ opacity: 0, scale: 0 }}
                  style={{ transform: "translate(-50%, -50%)" }}
                >
                  {obj.emoji}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Player */}
            <motion.div
              className="absolute bottom-[10%] text-4xl"
              animate={{ left: `${playerX}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{ transform: "translateX(-50%)" }}
            >
              🚤
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
