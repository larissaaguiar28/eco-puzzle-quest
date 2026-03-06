import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TreePine, Recycle, Droplets, Wind, Leaf, Sun,
  ChevronLeft, ChevronRight, Shield, Zap, Award, Trophy, Star, Sprout
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// --- DADOS DE CONFIGURAÇÃO ---
const GAMES = [
  { id: 1, title: "Guardião da Floresta", description: "Proteja a biodiversidade e restaure biomas degradados.", icon: TreePine, color: "from-emerald-400 to-green-700", image: "https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&q=80&w=1000" },
  { id: 2, title: "Recicla Quest", description: "Domine a economia circular e transforme resíduos em recursos.", icon: Recycle, color: "from-blue-400 to-indigo-700", image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1000" },
  { id: 3, title: "Oceano Limpo", description: "Recupere recifes de coral e remova microplásticos dos mares.", icon: Droplets, color: "from-cyan-400 to-blue-700", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000" },
  { id: 4, title: "Energia Verde", description: "Projete a rede elétrica do futuro com fontes 100% renováveis.", icon: Wind, color: "from-amber-400 to-orange-700", image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1000" }
];

const INITIAL_BADGES = [
  { icon: TreePine, name: "Guardião", description: "10 missões de reflorestamento" },
  { icon: Recycle, name: "Mestre", description: "Reciclou 500 itens" },
  { icon: Droplets, name: "Protetor", description: "Limpou 3 oceanos" },
  { icon: Leaf, name: "Eco Iniciante", description: "Completou o tutorial" },
  { icon: Sun, name: "Solar Champion", description: "100 painéis solares" },
  { icon: Shield, name: "Defensor", description: "Bloqueou 50 ameaças" },
  { icon: Zap, name: "Energia Viva", description: "Gerou 1GW limpo" },
  { icon: Award, name: "Veterano", description: "30 dias seguidos" }
];

// --- COMPONENTE: CONTADOR DE XP INTERATIVO (HEADER) ---
const XPCounter = ({ value }: { value: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1.2, 0.2],
                  x: (i % 2 === 0 ? 1 : -1) * (Math.random() * 60 + 20),
                  y: (i < 4 ? 1 : -1) * (Math.random() * 60 + 20)
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                className="absolute inset-0 m-auto w-2 h-2 bg-emerald-400 rounded-full blur-[1px] z-0"
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <Badge 
        className={cn(
          "relative z-10 px-6 py-3 rounded-full shadow-lg text-lg font-bold flex items-center gap-2 transition-all duration-500 overflow-hidden",
          isHovered 
            ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/40" 
            : "bg-white border-emerald-100 text-emerald-700"
        )}
      >
        <motion.div
          animate={isHovered ? { rotate: [0, -20, 20, 0], scale: 1.25 } : {}}
          transition={{ repeat: Infinity, duration: 0.6 }}
        >
          <Zap size={18} className={cn("transition-colors", isHovered ? "fill-white text-white" : "fill-emerald-500 text-emerald-500")} />
        </motion.div>

        <motion.span
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="tabular-nums relative z-10"
        >
          {value} XP
        </motion.span>

        <motion.div 
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
          animate={isHovered ? { translateX: ["150%", "-150%"] } : {}}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        />
      </Badge>

      <div className={cn(
        "absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 -z-10",
        isHovered ? "bg-emerald-400/50 opacity-100" : "bg-emerald-400/10 opacity-0"
      )} />
    </motion.div>
  );
};

// --- COMPONENTE DE PROGRESSO ---
const XPProgress = ({ xp, xpNext, level }: { xp: number; xpNext: number; level: number }) => {
  const progress = (xp / xpNext) * 100;
  return (
    <Card className="relative overflow-hidden border border-emerald-500/30 bg-slate-900 p-8 rounded-[3rem] shadow-2xl h-full flex flex-col justify-center">
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full" />
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div className="relative shrink-0">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
            <motion.circle
              cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * progress) / 100 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-emerald-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white leading-none">{level}</span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase">Nível</span>
          </div>
        </div>
        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Semente de Herói <Sprout size={20} className="text-emerald-400" />
            </h3>
            <span className="text-sm font-bold text-emerald-400">{xp} / {xpNext} XP</span>
          </div>
          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${progress}%` }} 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function GamesPage() {
  const [index, setIndex] = useState(0);
  const [badges, setBadges] = useState(INITIAL_BADGES);
  const [totalXp, setTotalXp] = useState(2350);
  const featured = GAMES[index];

  const REWARD_XP = 120; // Valor solicitado
  const xpNextLevel = 3000;
  const currentLevel = Math.floor(totalXp / 400) + 1;

  const handleStartMission = () => {
    setTotalXp(prev => prev + REWARD_XP);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextBadge();
    }, 4000);
    return () => clearInterval(interval);
  }, [badges]);

  const handleNextBadge = () => {
    setBadges((prev) => {
      const newArr = [...prev];
      const first = newArr.shift();
      if (first) newArr.push(first);
      return newArr;
    });
  };

  const handlePrevBadge = () => {
    setBadges((prev) => {
      const newArr = [...prev];
      const last = newArr.pop();
      if (last) newArr.unshift(last);
      return newArr;
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F7F4] p-4 md:p-10 font-sans text-slate-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER COM XP INTERATIVO */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-emerald-950">ECO<span className="text-emerald-500">PLAY</span></h1>
            <p className="text-slate-500 font-medium italic">Sua jornada sustentável começa aqui.</p>
          </div>
          <XPCounter value={totalXp} />
        </header>

        {/* HERO SECTION */}
        <section className="grid lg:grid-cols-12 gap-8 relative">
          <div className="lg:col-span-8 relative">
            <Card className="h-[500px] md:h-[600px] rounded-[3.5rem] overflow-hidden border-none shadow-2xl bg-slate-900 relative">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="relative h-full w-full"
                >
                  <img src={featured.image} className="absolute inset-0 w-full h-full object-cover opacity-40" alt={featured.title} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-emerald-950/70 to-black/80" />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16 z-10 text-center">
                    <motion.div 
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className={cn("inline-flex p-5 rounded-3xl bg-gradient-to-br mb-6 shadow-2xl border border-white/20", featured.color)}
                    >
                      <featured.icon size={42} className="text-white" />
                    </motion.div>

                    <h2 className="text-4xl md:text-7xl font-black text-white mb-6 leading-none tracking-tight max-w-2xl drop-shadow-2xl">
                      {featured.title}
                    </h2>

                    <p className="text-emerald-50 text-lg md:text-xl max-w-lg mb-10 font-medium leading-relaxed drop-shadow-lg">
                      {featured.description}
                    </p>

                    <motion.button 
                      onClick={handleStartMission}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative flex flex-col items-center gap-1"
                    >
                      <div className="px-12 py-5 bg-emerald-500 group-hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl transition-all shadow-[0_20px_50px_rgba(16,185,129,0.4)]">
                        INICIAR MISSÃO
                      </div>
                      {/* Badge de Recompensa de XP */}
                      <div className="absolute -top-4 -right-4 bg-amber-400 text-amber-950 text-xs font-black px-3 py-1.5 rounded-full border-2 border-slate-900 shadow-xl animate-bounce">
                        +{REWARD_XP} XP
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-6 pointer-events-none z-30">
                <button onClick={() => setIndex((index - 1 + GAMES.length) % GAMES.length)} className="p-4 rounded-full bg-black/40 backdrop-blur-xl text-white pointer-events-auto hover:bg-emerald-500 transition-all border border-white/10">
                  <ChevronLeft size={28} />
                </button>
                <button onClick={() => setIndex((index + 1) % GAMES.length)} className="p-4 rounded-full bg-black/40 backdrop-blur-xl text-white pointer-events-auto hover:bg-emerald-500 transition-all border border-white/10">
                  <ChevronRight size={28} />
                </button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4">
            <h3 className="text-xs font-black text-emerald-900/40 uppercase tracking-[0.2em] ml-4">Próximos Destinos</h3>
            {GAMES.map((game, i) => (
              <button key={game.id} onClick={() => setIndex(i)} className={cn("flex items-center gap-4 p-4 rounded-[2.5rem] transition-all border-2", i === index ? "bg-white border-emerald-500 shadow-xl" : "bg-emerald-50/50 border-transparent opacity-60 hover:opacity-100")}>
                <div className={cn("p-3 rounded-2xl bg-gradient-to-br shadow-md", game.color)}>
                    <game.icon size={20} className="text-white" />
                </div>
                <div className="text-left">
                    <h4 className="font-bold text-slate-800 leading-none mb-1">{game.title}</h4>
                    <span className="text-[10px] font-black text-emerald-600 uppercase">Explorar região</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* SEÇÃO INFERIOR */}
        <section className="grid lg:grid-cols-2 gap-8 items-stretch">
          <XPProgress xp={totalXp % xpNextLevel} xpNext={xpNextLevel} level={currentLevel} />

          <Card className="bg-slate-900 border border-emerald-500/30 rounded-[3rem] p-8 shadow-2xl relative flex flex-col justify-center overflow-hidden min-h-[250px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full" />
            <div className="flex items-center justify-between mb-8 z-10">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                Minhas Insígnias <Trophy className="text-amber-400 animate-bounce" size={20} />
              </h3>
              <div className="flex gap-2">
                <button onClick={handlePrevBadge} className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500 text-white transition-all">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={handleNextBadge} className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500 text-white transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <div className="relative h-24 overflow-hidden">
              <TooltipProvider delayDuration={0}>
                <div className="flex gap-5 items-center justify-center">
                  <AnimatePresence mode="popLayout">
                    {badges.slice(0, 4).map((badge) => (
                      <Tooltip key={badge.name}>
                        <TooltipTrigger asChild>
                          <motion.div 
                            layout
                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -50, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center cursor-pointer group hover:border-emerald-400 shadow-xl"
                          >
                            <badge.icon size={36} className="text-emerald-400 group-hover:text-white transition-colors" />
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-emerald-500 text-emerald-950 font-bold p-3 rounded-xl border-none shadow-2xl">
                          <p className="uppercase text-[10px] tracking-wider">{badge.name}</p>
                          <p className="text-[11px] font-medium opacity-80">{badge.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </AnimatePresence>
                  <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-[2rem] border-2 border-dashed border-white/10 flex items-center justify-center bg-white/5">
                    <Star size={24} className="text-white/20 animate-pulse" />
                  </div>
                </div>
              </TooltipProvider>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}