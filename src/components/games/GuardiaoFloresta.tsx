import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onExit: () => void;
  onXP: (amount: number) => void;
}

const TOTAL_TREES = 12;
const TREE_EMOJIS = ["🌱", "🌿", "🌳", "🌲"];

export default function GuardiaoFloresta({ onExit, onXP }: Props) {
  const [trees, setTrees] = useState<{ quality: number; planted: boolean }[]>(
    Array.from({ length: TOTAL_TREES }, () => ({ quality: 0, planted: false }))
  );
  const [currentSlot, setCurrentSlot] = useState(0);
  const [barPos, setBarPos] = useState(0);
  const [barDir, setBarDir] = useState(1);
  const [planting, setPlanting] = useState(false);
  const [totalXPEarned, setTotalXPEarned] = useState(0);
  const [startTime] = useState(Date.now());
  const [finished, setFinished] = useState(false);

  const allPlanted = trees.every((t) => t.planted);

  // Oscillating bar
  useEffect(() => {
    if (finished) return;
    const interval = setInterval(() => {
      setBarPos((prev) => {
        let next = prev + barDir * 2;
        if (next >= 100) { setBarDir(-1); next = 100; }
        if (next <= 0) { setBarDir(1); next = 0; }
        return next;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [barDir, finished]);

  useEffect(() => {
    if (allPlanted) setFinished(true);
  }, [allPlanted]);

  const handlePlant = () => {
    if (planting || finished) return;
    setPlanting(true);

    // Green zone: 40-60 = perfect, 25-75 = good, else = okay
    const pos = barPos;
    let quality: number;
    let xp: number;

    if (pos >= 40 && pos <= 60) {
      quality = 3; // perfect 🌲
      xp = 10;
    } else if (pos >= 25 && pos <= 75) {
      quality = 2; // good 🌳
      xp = 8;
    } else {
      quality = 1; // okay 🌿
      xp = 5;
    }

    onXP(xp);
    setTotalXPEarned((prev) => prev + xp);

    setTrees((prev) => {
      const next = [...prev];
      next[currentSlot] = { quality, planted: true };
      return next;
    });

    setTimeout(() => {
      setPlanting(false);
      // Find next unplanted slot
      const nextSlot = trees.findIndex((t, i) => i > currentSlot && !t.planted);
      if (nextSlot !== -1) {
        setCurrentSlot(nextSlot);
      } else {
        const first = trees.findIndex((t, i) => !t.planted && i !== currentSlot);
        if (first !== -1) setCurrentSlot(first);
      }
    }, 400);
  };

  const elapsed = Math.floor((Date.now() - startTime) / 1000);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-900 p-4 md:p-8 text-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onExit} className="text-slate-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Sair da Missão
          </Button>
          <span className="text-emerald-400 font-bold text-sm">
            <TreePine className="inline h-4 w-4 mr-1" />
            {trees.filter((t) => t.planted).length}/{TOTAL_TREES} árvores
          </span>
        </div>

        <h2 className="text-3xl font-black text-center mb-2">
          <TreePine className="inline mr-2 text-emerald-400" /> Guardião da Floresta
        </h2>
        <p className="text-emerald-300/50 text-center mb-6 text-sm">
          Clique quando a barra estiver na zona verde para plantar!
        </p>

        {finished ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
            <h3 className="text-4xl font-black mb-4">🌳 Floresta Restaurada!</h3>
            <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto mb-6">
              {trees.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-4xl text-center"
                >
                  {TREE_EMOJIS[t.quality]}
                </motion.div>
              ))}
            </div>
            <p className="text-emerald-400 font-bold text-xl mb-2">+{totalXPEarned} XP ganhos!</p>
            <p className="text-slate-400 mb-6">Tempo: {elapsed}s</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => { setTrees(Array.from({ length: TOTAL_TREES }, () => ({ quality: 0, planted: false }))); setCurrentSlot(0); setTotalXPEarned(0); setFinished(false); }} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
                Jogar Novamente
              </Button>
              <Button variant="outline" onClick={onExit} className="border-slate-600">Voltar ao Menu</Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Forest grid */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {trees.map((tree, i) => (
                <motion.div
                  key={i}
                  className={`h-20 rounded-2xl flex items-center justify-center text-3xl border-2 transition-all ${
                    tree.planted
                      ? "bg-emerald-900/30 border-emerald-500/30"
                      : i === currentSlot
                      ? "bg-emerald-500/10 border-emerald-400 border-dashed animate-pulse"
                      : "bg-slate-800/30 border-slate-700/30"
                  }`}
                  animate={tree.planted ? { scale: [0.5, 1.2, 1] } : {}}
                >
                  {tree.planted ? TREE_EMOJIS[tree.quality] : i === currentSlot ? "📍" : ""}
                </motion.div>
              ))}
            </div>

            {/* Precision bar */}
            <div className="bg-slate-800 rounded-full h-8 relative overflow-hidden mb-4 border border-slate-700">
              {/* Zones */}
              <div className="absolute inset-y-0 left-[25%] right-[25%] bg-emerald-500/20" />
              <div className="absolute inset-y-0 left-[40%] right-[40%] bg-emerald-500/40" />
              {/* Indicator */}
              <motion.div
                className="absolute top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_white]"
                style={{ left: `${barPos}%` }}
              />
            </div>

            <div className="text-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handlePlant}
                disabled={planting}
                className="px-12 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-lg shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 transition-all"
              >
                🌱 PLANTAR!
              </motion.button>
              <p className="text-xs text-slate-500 mt-3">Centro = árvore perfeita 🌲 | Bordas = muda pequena 🌿</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
