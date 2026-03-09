import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TreePine, Recycle, Droplets, Wind, Leaf, Sun,
  ChevronLeft, ChevronRight, Shield, Zap, Award, Trophy, Sprout,
  Gamepad2, Flame
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// --- CONFIGURAÇÃO DOS JOGOS ---
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
  { icon: Leaf, name: "Eco Iniciante", description: "Jogou pela primeira vez" },
  { icon: Sun, name: "Solar Champion", description: "100 painéis solares" },
  { icon: Shield, name: "Defensor", description: "Bloqueou 50 ameaças" },
  { icon: Zap, name: "Energia Viva", description: "Gerou 1GW limpo" },
  { icon: Award, name: "Veterano", description: "Chegou no Nível 10" }
];

// --- COMPONENTE: CONTADOR DE XP (HEADER) ---
const XPCounter = ({ value }: { value: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setIsChanging(true);
    const timer = setTimeout(() => setIsChanging(false), 400);
    return () => clearTimeout(timer);
  }, [value]);

  const digits = Math.abs(value).toString().split("");

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer"
      animate={isChanging ? { scale: [1, 1.15, 1] } : {}}
    >
      <Badge className={cn(
        "relative z-10 px-6 py-3 rounded-full shadow-lg text-lg font-bold flex items-center gap-1 transition-all duration-500 border-2",
        isHovered ? "bg-emerald-500 text-white border-emerald-300" : "bg-white border-emerald-100 text-emerald-700"
      )}>
        <Zap size={18} className={cn("mr-1", isHovered ? "fill-white" : "fill-emerald-500")} />
        <div className="flex h-[1.2em] items-center tabular-nums font-black overflow-hidden px-0.5">
          <AnimatePresence mode="popLayout" initial={false}>
            {digits.map((digit, index) => (
              <motion.span
                key={`${digits.length - index}-${digit}`}
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -25, opacity: 0 }}
                className="inline-block"
              >
                {digit}
              </motion.span>
            ))}
          </AnimatePresence>
          <span className="ml-1 text-xs opacity-70">XP</span>
        </div>
      </Badge>
    </motion.div>
  );
};

// --- COMPONENTE: CARD DE PROGRESSO ---
const XPProgress = ({ xp, xpNext, level, userName, streak, matches }: { xp: number; xpNext: number; level: number; userName: string; streak: number; matches: number }) => {
  const progress = (xp / xpNext) * 100;
  
  const getStreakConfig = (days: number) => {
    if (days === 0) return { color: "text-slate-500", scale: 1, glow: "transparent" };
    if (days < 3) return { color: "text-orange-400", scale: 1.1, glow: "rgba(251,146,60,0.3)" };
    if (days < 7) return { color: "text-orange-600", scale: 1.25, glow: "rgba(234,88,12,0.5)" };
    return { color: "text-red-500", scale: 1.4, glow: "rgba(239,68,68,0.7)" };
  };

  const streakConfig = getStreakConfig(streak);

  return (
    <Card className="relative overflow-hidden border border-emerald-500/30 bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl h-full flex flex-col transition-all hover:scale-[1.01]">
      <div className="p-6 md:p-8 pb-4 flex flex-col md:flex-row items-center gap-6">
        <div className="relative shrink-0">
          <svg className="w-20 h-20 md:w-24 md:h-24 transform -rotate-90">
            <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5 md:hidden" />
            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5 hidden md:block" />
            
            {/* Desktop circle */}
            <motion.circle
              cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
              strokeDasharray="251.2"
              animate={{ strokeDashoffset: 251.2 - (251.2 * progress) / 100 }}
              className="text-emerald-500 hidden md:block"
            />
            {/* Mobile circle */}
            <motion.circle
              cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="6" fill="transparent"
              strokeDasharray="219.9"
              animate={{ strokeDashoffset: 219.9 - (219.9 * progress) / 100 }}
              className="text-emerald-500 md:hidden"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl md:text-2xl font-black text-white">{level}</span>
            <span className="text-[8px] md:text-[10px] font-bold text-emerald-400 uppercase">Nível</span>
          </div>
        </div>

        <div className="flex-1 space-y-3 md:space-y-4 text-center md:text-left w-full overflow-hidden">
          <div className="truncate">
            <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest opacity-70">Herói: {userName}</span>
            <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
              Semente de Herói <Sprout size={18} className="text-emerald-400 shrink-0" />
            </h3>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] md:text-[10px] font-black text-emerald-400 uppercase">
              <span>Progresso</span>
              <span>{Math.floor(xp)} / {xpNext} XP</span>
            </div>
            <div className="h-2.5 md:h-3 w-full bg-white/5 rounded-full border border-white/10 p-0.5">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${progress}%` }} 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RODAPÉ AJUSTADO: Usando flex-wrap e min-width para evitar quebra de layout */}
      <div className="mt-auto bg-white/5 border-t border-white/10 px-4 md:px-8 py-4 flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-12">
        <TooltipProvider>
          {/* Status: Sequência */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 md:gap-3 cursor-default min-w-[120px]">
                <motion.div 
                  animate={{ scale: streakConfig.scale }}
                  style={{ filter: `drop-shadow(0 0 8px ${streakConfig.glow})` }}
                  className={cn("p-2 md:p-2.5 rounded-xl bg-slate-800 border border-white/5 shrink-0", streakConfig.color)}
                >
                  <Flame size={20} fill="currentColor" className={streak >= 7 ? "animate-pulse" : ""} />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase leading-none mb-1">Sequência</span>
                  <span className={cn("text-base md:text-lg font-black leading-none", streakConfig.color)}>{streak} dias</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-orange-600 text-white font-bold border-none">Acessos consecutivos</TooltipContent>
          </Tooltip>

          {/* Status: Partidas */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 md:gap-3 cursor-default min-w-[120px]">
                <div className="p-2 md:p-2.5 rounded-xl bg-slate-800 border border-white/5 text-emerald-400 shrink-0">
                  <Gamepad2 size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase leading-none mb-1">Partidas</span>
                  <span className="text-base md:text-lg font-black text-white leading-none">{matches} missões</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-emerald-600 text-white font-bold border-none">Total de missões iniciadas</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};

// --- PÁGINA PRINCIPAL ---
export default function GamesPage() {
  const [userName] = useState("Alex Silva");
  const [index, setIndex] = useState(0);
  const [totalXp, setTotalXp] = useState(2350);
  const [matches, setMatches] = useState(15);
  const [streakDays] = useState(5); 
  const [badges, setBadges] = useState(INITIAL_BADGES);
  
  const featured = GAMES[index];

  const handleStartMission = () => {
    setTotalXp(prev => prev + 120);
    setMatches(prev => prev + 1);
  };

  const handleNextBadge = () => setBadges(prev => {
    const arr = [...prev];
    const item = arr.shift();
    if (item) arr.push(item);
    return arr;
  });

  const handlePrevBadge = () => setBadges(prev => {
    const arr = [...prev];
    const item = arr.pop();
    if (item) arr.unshift(item);
    return arr;
  });

  return (
    <div className="min-h-screen bg-[#F0F7F4] p-4 md:p-10 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8 md:y-12">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-emerald-950 uppercase tracking-tighter">
              ECO<span className="text-emerald-500">PLAY</span>
            </h1>
            <p className="text-slate-500 font-medium italic text-sm md:text-base">A aventura da sustentabilidade.</p>
          </div>
          <XPCounter value={totalXp} />
        </header>

        <section className="grid lg:grid-cols-12 gap-6 md:gap-8">
          <div className="lg:col-span-8 relative">
            <Card className="h-[450px] md:h-[600px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-slate-900 relative border-none shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  <img src={featured.image} className="absolute inset-0 w-full h-full object-cover opacity-40" alt={featured.title} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8 text-center z-10">
                    <div className={cn("p-4 md:p-5 rounded-2xl md:rounded-3xl bg-gradient-to-br mb-4 md:mb-6", featured.color)}>
                      <featured.icon size={32} className="text-white md:hidden" />
                      <featured.icon size={42} className="text-white hidden md:block" />
                    </div>
                    <h2 className="text-3xl md:text-7xl font-black text-white mb-2 md:mb-4">{featured.title}</h2>
                    <p className="text-emerald-50 text-sm md:text-lg max-w-lg mb-6 md:mb-8 line-clamp-3">{featured.description}</p>
                    <motion.button 
                      onClick={handleStartMission}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 md:px-12 py-4 md:py-5 bg-emerald-500 text-emerald-950 font-black rounded-xl md:rounded-2xl shadow-xl text-sm md:text-base"
                    >
                      INICIAR MISSÃO
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-6 z-20 pointer-events-none">
                <button onClick={() => setIndex((index - 1 + GAMES.length) % GAMES.length)} className="p-3 md:p-4 rounded-full bg-black/40 text-white pointer-events-auto hover:bg-emerald-500 transition-all">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={() => setIndex((index + 1) % GAMES.length)} className="p-3 md:p-4 rounded-full bg-black/40 text-white pointer-events-auto hover:bg-emerald-500 transition-all">
                  <ChevronRight size={24} />
                </button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 md:gap-4">
            <h3 className="text-[10px] md:text-xs font-black text-emerald-900/40 uppercase tracking-widest ml-4">Jogos Disponíveis</h3>
            {GAMES.map((game, i) => (
              <button key={game.id} onClick={() => setIndex(i)} className={cn("flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all", i === index ? "bg-white border-emerald-500 shadow-lg scale-[1.02]" : "bg-emerald-50/50 border-transparent opacity-60 hover:opacity-100")}>
                <div className={cn("p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br", game.color)}>
                  <game.icon size={18} className="text-white" />
                </div>
                <div className="text-left font-bold text-slate-800 text-sm md:text-base">{game.title}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <XPProgress 
            xp={totalXp % 1000} 
            xpNext={1000} 
            level={Math.floor(totalXp / 1000) + 1} 
            userName={userName}
            streak={streakDays}
            matches={matches}
          />

          <Card className="bg-slate-900 border border-emerald-500/30 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[220px] md:min-h-[250px]">
            <div className="flex items-center justify-between mb-6 md:mb-8 z-10">
              <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2">Insígnias <Trophy className="text-amber-400" size={20} /></h3>
              <div className="flex gap-2">
                <button onClick={handlePrevBadge} className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500 text-white"><ChevronLeft size={18} /></button>
                <button onClick={handleNextBadge} className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500 text-white"><ChevronRight size={18} /></button>
              </div>
            </div>
            <div className="flex gap-3 md:gap-4 justify-center overflow-hidden">
              <AnimatePresence mode="popLayout">
                {badges.slice(0, 4).map((badge) => (
                  <motion.div key={badge.name} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <badge.icon size={28} className="text-emerald-400 md:hidden" />
                    <badge.icon size={32} className="text-emerald-400 hidden md:block" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}