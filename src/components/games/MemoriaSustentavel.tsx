import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onExit: () => void;
  onXP: (amount: number) => void;
}

const PAIRS = [
  { id: "solar", emoji: "☀️", match: "painel", matchEmoji: "🌡️" },
  { id: "vento", emoji: "💨", match: "turbina", matchEmoji: "🌪️" },
  { id: "agua", emoji: "💧", match: "hidro", matchEmoji: "🌊" },
  { id: "planta", emoji: "🌱", match: "arvore", matchEmoji: "🌳" },
  { id: "recicla", emoji: "♻️", match: "lixeira", matchEmoji: "🗑️" },
  { id: "bici", emoji: "🥕", match: "verde", matchEmoji: "🐇" },
];

interface Card {
  uid: string;
  pairId: string;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards(): Card[] {
  const cards: Card[] = [];
  PAIRS.forEach((p) => {
    cards.push({ uid: p.id + "-a", pairId: p.id, emoji: p.emoji, flipped: false, matched: false });
    cards.push({ uid: p.id + "-b", pairId: p.id, emoji: p.matchEmoji, flipped: false, matched: false });
  });
  return shuffle(cards);
}

export default function MemoriaSustentavel({ onExit, onXP }: Props) {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [locked, setLocked] = useState(false);

  const totalPairs = PAIRS.length;


  useEffect(() => {
    if (matchedCount === totalPairs && !finished) {
      onXP(100);
      setFinished(true);
    }
  }, [matchedCount, totalPairs, onXP, finished]);

  const handleFlip = (uid: string) => {
    if (locked) return;
    const card = cards.find((c) => c.uid === uid);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flippedIds, uid];
    setCards((prev) => prev.map((c) => (c.uid === uid ? { ...c, flipped: true } : c)));
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const [first, second] = newFlipped;
      const c1 = cards.find((c) => c.uid === first)!;
      const c2 = cards.find((c) => c.uid === second || c.uid === uid)!;
      const actualC2 = c2.uid === uid ? { ...c2, flipped: true } : c2;

      if (c1.pairId === actualC2.pairId && c1.uid !== actualC2.uid) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.pairId === c1.pairId ? { ...c, matched: true } : c))
          );
          setMatchedCount((m) => m + 1);
          setFlippedIds([]);
          setLocked(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (newFlipped.includes(c.uid) ? { ...c, flipped: false } : c)));
          setFlippedIds([]);
          setLocked(false);
        }, 800);
      }
    }
  };

  const restart = () => {
    setCards(createCards());
    setFlippedIds([]);
    setMoves(0);
    setMatchedCount(0);
    setFinished(false);
    setLocked(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-900 p-4 md:p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onExit} className="text-slate-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Sair da Missão
          </Button>
          <div className="flex gap-4 text-sm font-bold">
            <span className="text-indigo-400">🃏 {moves} jogadas</span>
            <span className="text-emerald-400">✅ {matchedCount}/{totalPairs}</span>
          </div>
        </div>

        <h2 className="text-3xl font-black text-center mb-2">
          <Brain className="inline mr-2 text-indigo-400" /> Memória Sustentável
        </h2>
        <p className="text-indigo-300/50 text-center mb-6 text-sm">
          Encontre os pares de conceitos ecológicos!
        </p>

        {finished ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
            <h3 className="text-4xl font-black mb-4">🧠 Incrível!</h3>
            <p className="text-2xl text-indigo-400 font-bold mb-2">Completou em {moves} jogadas!</p>
            <p className="text-emerald-400 font-bold text-xl mb-8">+100 XP ganhos!</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={restart} className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold">
                Jogar Novamente
              </Button>
              <Button variant="outline" onClick={onExit} className="border-slate-600">Voltar ao Menu</Button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {cards.map((card) => (
              <motion.button
                key={card.uid}
                onClick={() => handleFlip(card.uid)}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-2xl text-4xl flex items-center justify-center border-2 transition-all duration-300 ${card.matched
                    ? "bg-emerald-500/20 border-emerald-500/50 opacity-60"
                    : card.flipped
                      ? "bg-indigo-500/20 border-indigo-400"
                      : "bg-slate-800/80 border-slate-700/50 hover:border-indigo-400/50 hover:bg-slate-700/50"
                  }`}
              >
                <motion.span
                  animate={{ rotateY: card.flipped || card.matched ? 0 : 180, opacity: card.flipped || card.matched ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {(card.flipped || card.matched) ? card.emoji : ""}
                </motion.span>
                {!card.flipped && !card.matched && (
                  <span className="text-slate-600 text-2xl">❓</span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
