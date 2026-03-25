import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Leaf, RotateCcw, Award, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onExit: () => void;
  onXP: (amount: number) => void;
}

const PAIRS = [
  { id: "solar", emoji: "☀️", match: "painel", matchEmoji: "🌡️", color: "from-amber-300 to-orange-500", shadow: "shadow-orange-500/40" },
  { id: "vento", emoji: "💨", match: "turbina", matchEmoji: "🌪️", color: "from-cyan-300 to-blue-500", shadow: "shadow-blue-500/40" },
  { id: "agua", emoji: "💧", match: "hidro", matchEmoji: "🌧️", color: "from-blue-400 to-indigo-500", shadow: "shadow-indigo-500/40" },
  { id: "planta", emoji: "🌱", match: "arvore", matchEmoji: "🌳", color: "from-lime-400 to-emerald-600", shadow: "shadow-emerald-500/40" },
  { id: "recicla", emoji: "♻️", match: "lixeira", matchEmoji: "🗑️", color: "from-teal-300 to-emerald-500", shadow: "shadow-teal-500/40" },
  { id: "bici", emoji: "🥕", match: "verde", matchEmoji: "🐇", color: "from-green-300 to-emerald-500", shadow: "shadow-green-500/40" },
];

interface Card {
  uid: string;
  pairId: string;
  emoji: string;
  color: string;
  shadow: string;
  isFlipped: boolean;
  isMatched: boolean;
  isError: boolean;
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
    cards.push({ uid: p.id + "-a", pairId: p.id, emoji: p.emoji, color: p.color, shadow: p.shadow, isFlipped: false, isMatched: false, isError: false });
    cards.push({ uid: p.id + "-b", pairId: p.id, emoji: p.matchEmoji, color: p.color, shadow: p.shadow, isFlipped: false, isMatched: false, isError: false });
  });
  return shuffle(cards);
}

// Fundo de Vagalumes Mágicos
const Fireflies = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-emerald-300/60 rounded-full blur-[2px]"
        initial={{ 
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
          y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
          scale: Math.random() * 0.5 + 0.5
        }}
        animate={{ 
          y: [null, Math.random() * -200 - 100],
          x: [null, (Math.random() - 0.5) * 100],
          opacity: [0, 0.8, 0]
        }}
        transition={{ 
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 5
        }}
      />
    ))}
  </div>
);

export default function MemoriaSustentavel({ onExit, onXP }: Props) {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [locked, setLocked] = useState(false);

  const totalPairs = PAIRS.length;
  const progress = (matchedCount / totalPairs) * 100;

  useEffect(() => {
    if (matchedCount === totalPairs && !finished) {
      setTimeout(() => {
        onXP(200); 
        setFinished(true);
      }, 800);
    }
  }, [matchedCount, totalPairs, onXP, finished]);

  const handleFlip = (uid: string) => {
    if (locked) return;
    
    const cardIndex = cards.findIndex(c => c.uid === uid);
    if (cardIndex === -1 || cards[cardIndex].isFlipped || cards[cardIndex].isMatched) return;

    const newCards = [...cards];
    newCards[cardIndex].isFlipped = true;
    setCards(newCards);

    const newFlippedIds = [...flippedIds, uid];
    setFlippedIds(newFlippedIds);

    if (newFlippedIds.length === 2) {
      setLocked(true); 
      setMoves((m) => m + 1);
      
      const card1 = newCards.find(c => c.uid === newFlippedIds[0])!;
      const card2 = newCards.find(c => c.uid === newFlippedIds[1])!;

      if (card1.pairId === card2.pairId) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.pairId === card1.pairId ? { ...c, isMatched: true } : c))
          );
          setMatchedCount((m) => m + 1);
          setFlippedIds([]);
          setLocked(false);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) => prev.map((c) => (newFlippedIds.includes(c.uid) ? { ...c, isError: true } : c)));
        }, 400);

        setTimeout(() => {
          setCards((prev) => prev.map((c) => (newFlippedIds.includes(c.uid) ? { ...c, isFlipped: false, isError: false } : c)));
          setFlippedIds([]);
          setLocked(false);
        }, 1000);
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
    <div className="min-h-screen bg-[#022c22] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900 via-[#064e3b] to-[#022c22] p-4 md:p-8 text-white font-sans overflow-hidden relative">
      
      <Fireflies />
      
      {/* Luzes de Fundo Estáticas */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col min-h-[90vh]">
        
        {/* --- HUD PREMIUM (CABEÇALHO) --- */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 bg-white/5 p-5 rounded-[2.5rem] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <Button 
            variant="ghost" 
            onClick={onExit} 
            className="text-emerald-100 hover:text-white hover:bg-white/10 rounded-full font-black px-6 transition-all"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> SAIR
          </Button>
          
          <div className="flex-1 w-full md:px-10 flex flex-col justify-center">
            <div className="flex justify-between text-xs font-black uppercase text-emerald-400 mb-2 tracking-[0.2em] drop-shadow-md">
              <span>Sinergia Ecológica</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-4 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 to-green-300 relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 40, damping: 12 }}
              >
                {/* Brilho na ponta da barra */}
                <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-white/50 to-transparent" />
              </motion.div>
            </div>
          </div>

          <div className="bg-black/40 px-8 py-3 rounded-full border border-emerald-500/30 font-black text-emerald-300 flex items-center gap-2 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
            <Zap className="text-yellow-400 w-5 h-5 animate-pulse" />
            <span className="text-xl">{moves}</span> 
            <span className="text-xs uppercase tracking-widest opacity-70">Jogadas</span>
          </div>
        </div>

        {/* --- ÁREA DO JOGO --- */}
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {finished ? (
              // --- TELA DE VITÓRIA PREMIUM ---
              <motion.div 
                key="victory"
                initial={{ scale: 0.8, opacity: 0, y: 30 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                className="text-center py-16 px-8 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-2xl rounded-[3rem] border border-emerald-400/30 w-full max-w-xl shadow-[0_0_80px_rgba(16,185,129,0.2)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay pointer-events-none" />

                <motion.div 
                  animate={{ rotate: [0, 5, -5, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block mb-8 relative"
                >
                  <div className="absolute inset-0 bg-yellow-400 blur-[50px] opacity-40 rounded-full" />
                  <Award className="w-36 h-36 text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] relative z-10" />
                </motion.div>
                
                <h3 className="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-emerald-200 to-green-200 drop-shadow-sm tracking-tight">
                  NATUREZA SALVA!
                </h3>
                <p className="text-2xl text-emerald-100 font-bold mb-8 opacity-90">Sua memória precisou de apenas <span className="text-yellow-400">{moves} jogadas!</span></p>
                
                <div className="inline-flex items-center gap-3 bg-emerald-950/80 border-2 border-emerald-400/50 px-8 py-4 rounded-full mb-12 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <Sparkles className="text-yellow-400 w-8 h-8" />
                  <span className="text-emerald-300 font-black text-3xl">+200 XP</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                  <Button onClick={restart} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xl h-16 px-10 rounded-2xl shadow-[0_8px_0_#065f46] active:translate-y-2 active:shadow-none transition-all">
                    <RotateCcw className="mr-3 w-6 h-6" /> JOGAR NOVAMENTE
                  </Button>
                </div>
              </motion.div>
            ) : (
              // --- TABULEIRO DE CARTAS MAGNÍFICO ---
              <motion.div 
                key="board"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-3xl"
              >
                {cards.map((card) => (
                  <div key={card.uid} className="relative aspect-[3/4] perspective-[1200px] group">
                    <motion.div
                      onClick={() => handleFlip(card.uid)}
                      animate={{ 
                        rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                        x: card.isError ? [-10, 10, -10, 10, 0] : 0,
                        scale: card.isMatched ? [1, 1.05, 1] : 1
                      }}
                      transition={{ 
                        duration: card.isError ? 0.3 : 0.5,
                        type: card.isMatched ? "spring" : "tween",
                        stiffness: 200
                      }}
                      className="w-full h-full cursor-pointer relative"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* --- VERSO DA CARTA (Oculta) --- */}
                      <div 
                        className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#064e3b] to-[#022c22] rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.6)] border-2 border-emerald-500/20 flex items-center justify-center backface-hidden group-hover:border-emerald-400/60 transition-colors duration-300 overflow-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        {/* Brilho radial interno */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.15),transparent_60%)]" />
                        
                        <div className="w-20 h-20 rounded-full bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner border border-white/5">
                          <Leaf className="w-10 h-10 text-emerald-500/40 group-hover:text-emerald-400 transition-colors duration-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
                        </div>
                      </div>

                      {/* --- FRENTE DA CARTA (Revelada) --- */}
                      <div 
                        className={`absolute inset-0 w-full h-full bg-gradient-to-br ${card.color} rounded-[2rem] shadow-[0_15px_35px_rgba(0,0,0,0.5)] border-[3px] border-white/90 flex items-center justify-center overflow-hidden`}
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        {/* Efeito Carta Brilhante (Glossy Overlay) */}
                        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent opacity-80 z-0 pointer-events-none" />
                        
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: card.isFlipped || card.isMatched ? 1 : 0 }}
                          transition={{ delay: 0.15, type: "spring", stiffness: 250 }}
                          className={`text-6xl md:text-7xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] relative z-10`}
                        >
                          {card.emoji}
                        </motion.span>

                        {/* Overlay Bonitão quando Pareada */}
                        {card.isMatched && (
                          <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-20"
                          >
                            <div className="bg-white text-emerald-700 px-5 py-2 rounded-full font-black text-sm md:text-base uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.8)] rotate-[-10deg] scale-110 border-2 border-emerald-100">
                              PAR!
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}