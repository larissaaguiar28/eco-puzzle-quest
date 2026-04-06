import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trophy, Heart, Timer, MousePointer2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onExit: () => void;
  onXP: (amount: number) => void;
}

const BINS = [
  { type: "metal", label: "Metal", color: "bg-yellow-500", light: "bg-yellow-400/20", border: "border-yellow-400", emoji: "🟡" },
  { type: "plastic", label: "Plástico", color: "bg-red-500", light: "bg-red-400/20", border: "border-red-400", emoji: "🔴" },
  { type: "paper", label: "Papel", color: "bg-blue-500", light: "bg-blue-400/20", border: "border-blue-400", emoji: "🔵" },
  { type: "glass", label: "Vidro", color: "bg-green-500", light: "bg-green-400/20", border: "border-green-400", emoji: "🟢" },
];

const ITEMS = [
  { type: "metal", emoji: "📎", color: "text-yellow-400" },
  { type: "plastic", emoji: "🥤", color: "text-red-400" },
  { type: "paper", emoji: "📄", color: "text-blue-400" },
  { type: "glass", emoji: "🫙", color: "text-green-400" },
];

// Tipagem aprimorada para controle de re-renderização das animações
type ItemState = { id: number; x: number; y: number; type: string; emoji: string; color: string };
type HitEffectState = { text: string; id: number };

export default function ReciclaQuest({ onExit, onXP }: Props) {
  const [item, setItem] = useState<ItemState | null>(null);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timer, setTimer] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [hitEffect, setHitEffect] = useState<HitEffectState | null>(null);

  const itemRef = useRef<ItemState | null>(null);
  useEffect(() => {
    itemRef.current = item;
  }, [item]);

  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  const spawn = useCallback(() => {
    const t = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    // Centralizado perfeitamente nas colunas (12.5, 37.5, 62.5, 87.5) e ID único para animação de pop
    setItem({ id: Date.now(), x: 37.5, y: -10, type: t.type, emoji: t.emoji, color: t.color });
  }, []);

  // Game Loop de Alta Performance usando requestAnimationFrame
  const updateGame = useCallback((time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = time - lastTimeRef.current;

      // Lê o item atual a partir da Ref (não quebra o React)
      const currentItem = itemRef.current;

      if (currentItem) {
        const newY = currentItem.y + (0.045 * deltaTime);

        if (newY >= 85) {
          // COLISÃO! Toda a lógica de pontuação agora roda FORA do setItem
          const binIdx = Math.floor(currentItem.x / 25);
          if (binIdx >= 0 && binIdx < BINS.length && BINS[binIdx].type === currentItem.type) {
            setScore(s => s + 1);
            onXP(10); // Chamada segura do estado do pai!
            setHitEffect({ text: "✨ +10 XP", id: Date.now() });
          } else {
            setMisses(m => m + 1);
            setHitEffect({ text: "❌ ERRO", id: Date.now() });
          }
          setTimeout(() => setHitEffect(null), 800);

          // Destrói o item
          setItem(null);
        } else {
          // Apenas atualiza a posição
          setItem({ ...currentItem, y: newY });
        }
      }
    }

    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(updateGame);
  }, [onXP]);

  // Controle do Loop
  useEffect(() => {
    if (gameOver) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }
    requestRef.current = requestAnimationFrame(updateGame);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameOver, updateGame]);

  // Spawner desvinculado do loop principal
  useEffect(() => {
    if (!item && !gameOver) spawn();
  }, [item, gameOver, spawn]);

  // Controles (Deslizamento corrigido para eixos perfeitos)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setItem(p => p ? { ...p, x: Math.max(12.5, p.x - 25) } : null);
      if (e.key === "ArrowRight") setItem(p => p ? { ...p, x: Math.min(87.5, p.x + 25) } : null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const id = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(id);
    } else if (timer === 0) setGameOver(true);
  }, [timer, gameOver]);

  if (misses >= 5 && !gameOver) setGameOver(true);

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-[#000000] text-white flex flex-col items-center p-4 font-sans select-none relative overflow-hidden">

      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
          />
        ))}
      </div>

      <div className="w-full max-w-md flex flex-col h-[90vh] z-10">

        <div className="flex justify-between items-center bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl mb-4 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col items-center">
            <Timer className="h-4 w-4 text-cyan-400 mb-1" />
            <span className="font-mono text-xl font-bold">{timer}s</span>
          </div>
          <div className="text-center">
            <Trophy className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
            <span className="text-2xl font-black text-yellow-500">{score}</span>
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Heart key={i} className={`h-4 w-4 ${i < 5 - misses ? "fill-red-500 text-red-500" : "text-slate-800"}`} />
            ))}
          </div>
        </div>

        <div className="relative flex-1 bg-slate-900/50 rounded-[2rem] border-2 border-slate-800 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8),_inset_0_0_20px_rgba(0,0,0,0.5)]">

          <div className="absolute -inset-10 bg-[radial-gradient(closest-side,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent animate-pulse-slow pointer-events-none z-0" />

          <div className="absolute inset-0 grid grid-cols-4 pointer-events-none z-0">
            {BINS.map((bin, i) => (
              <div key={i} className={`h-full border-r border-white/5 transition-colors ${item && Math.floor(item.x / 25) === i ? bin.light : ""}`} />
            ))}
          </div>

          <AnimatePresence mode="popLayout">
            {hitEffect && (
              <motion.div
                key={hitEffect.id} // Chave dinâmica para re-animar acertos sucessivos
                initial={{ y: 150, scale: 0.5, opacity: 0 }}
                animate={{ y: 100, scale: 1.2, opacity: 1 }}
                exit={{ y: 50, scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="absolute w-full text-center z-50 font-black text-3xl drop-shadow-[0_0_20px_rgba(0,0,0,1)]"
              >
                <span className={hitEffect.text.includes("XP") ? "text-emerald-400" : "text-red-500"}>
                  {hitEffect.text}
                </span>
              </motion.div>
            )}

            {gameOver ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
                <div className="p-4 bg-cyan-500/10 rounded-full mb-6">
                  <Sparkles className="h-12 w-12 text-cyan-400" />
                </div>
                <h2 className="text-4xl font-black text-cyan-400 mb-2 tracking-tighter">MISSÃO CONCLUÍDA</h2>
                <p className="text-slate-400 mb-8 italic font-medium">O planeta agradece seu esforço!</p>
                <div className="bg-slate-900 rounded-2xl p-6 mb-12 border border-slate-800 shadow-xl">
                  <span className="text-5xl font-black text-white tracking-tight">{score * 10} XP</span>
                </div>
                <Button onClick={() => window.location.reload()} className="w-full h-16 text-xl font-bold bg-cyan-600 rounded-2xl shadow-[0_6px_0_#0891b2] active:translate-y-1 active:shadow-none transition-all hover:bg-cyan-500">
                  JOGAR NOVAMENTE
                </Button>
              </motion.div>
            ) : (
              item && (
                <motion.div
                  key={item.id}
                  className="absolute z-20 flex flex-col items-center"
                  // O Y é atualizado por style para performance (60fps), o transform: translateX lida com a centralização
                  style={{ top: `${item.y}%`, x: "-50%" }}
                  initial={{ scale: 0, left: `${item.x}%` }}
                  // O left (movimento horizontal) é animado com mola para criar o deslize
                  animate={{ scale: 1, left: `${item.x}%`, rotate: 360 }}
                  transition={{
                    scale: { type: "spring", stiffness: 300, damping: 20 },
                    left: { type: "spring", stiffness: 400, damping: 25 },
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" }
                  }}
                >
                  <span className={`text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]`}>{item.emoji}</span>
                  <div className="mt-2 h-4 w-4 border-l-4 border-b-4 border-white/20 rotate-[-45deg]" />
                </motion.div>
              )
            )}
          </AnimatePresence>

          {score === 0 && !item?.y && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="bg-black/60 p-5 rounded-2xl border border-white/10 text-center animate-pulse backdrop-blur-sm">
                <MousePointer2 className="mx-auto mb-3 text-cyan-400 h-6 w-6" />
                <p className="text-xs font-bold uppercase tracking-widest leading-relaxed text-slate-200">Toque na lixeira certa<br />ou use as setas</p>
              </div>
            </div>
          )}

          <div className="absolute bottom-0 w-full grid grid-cols-4 h-28 gap-2 p-2 bg-slate-950/80 backdrop-blur-md z-10 border-t border-slate-800">
            {BINS.map((bin, i) => (
              <motion.button
                key={bin.type}
                onClick={() => setItem(p => p ? { ...p, x: i * 25 + 12.5 } : null)}
                // Animação da lixeira levantando levemente quando o item está na rota dela
                animate={item && Math.floor(item.x / 25) === i ? { y: -8, scale: 1.02 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`group relative ${bin.color} rounded-2xl flex flex-col items-center justify-center border-b-4 ${bin.border} overflow-hidden shadow-lg`}
              >
                <span className="text-3xl z-10 drop-shadow-md">{bin.emoji}</span>
                <span className="text-[10px] font-black text-white/90 uppercase z-10 tracking-tighter">{bin.label}</span>
                {item && Math.floor(item.x / 25) === i && (
                  <motion.div layoutId="aim" className="absolute inset-0 border-4 border-white z-20 rounded-2xl shadow-[0_0_15px_white]" />
                )}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            ))}
          </div>
        </div>

        <button onClick={onExit} className="mt-6 flex items-center justify-center gap-2 text-slate-600 hover:text-cyan-400 transition-colors py-2 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> <span className="text-xs font-bold uppercase tracking-widest">Sair da Missão</span>
        </button>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}