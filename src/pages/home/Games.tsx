import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2,
  TreePine,
  Recycle,
  Droplets,
  Wind,
  Leaf,
  Sun,
  Star,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Award,
  LucideIcon,
  Trophy
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

// --- TIPAGENS ---
interface Game {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
}

interface BadgeItem {
  icon: LucideIcon;
  name: string;
  description: string;
}

const games: Game[] = [
  {
    id: 1,
    title: "Guardião da Floresta",
    description: "Proteja a Amazônia de ameaças ambientais em um jogo de estratégia imersivo.",
    icon: TreePine,
    image: "https://images.unsplash.com/photo-1508780709619-79562169bc64"
  },
  {
    id: 2,
    title: "Recicla Quest",
    description: "Separe e recicle materiais corretamente em desafios cronometrados.",
    icon: Recycle,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b"
  },
  {
    id: 3,
    title: "Oceano Limpo",
    description: "Navegue pelos oceanos removendo poluentes e salvando a vida marinha.",
    icon: Droplets,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    id: 4,
    title: "Energia Verde",
    description: "Construa e gerencie uma cidade sustentável movida a energias renováveis.",
    icon: Wind,
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7"
  }
];

const badges: BadgeItem[] = [
  { icon: TreePine, name: "Guardião da Floresta", description: "Completou 10 missões de reflorestamento" },
  { icon: Recycle, name: "Mestre da Reciclagem", description: "Reciclou 500 itens corretamente" },
  { icon: Droplets, name: "Protetor dos Oceanos", description: "Limpou 3 oceanos virtuais" },
  { icon: Leaf, name: "Eco Iniciante", description: "Completou o tutorial inicial" },
  { icon: Sun, name: "Solar Champion", description: "Instalou 100 painéis solares" },
  { icon: Shield, name: "Defensor Ambiental", description: "Bloqueou 50 ameaças ambientais" },
  { icon: Zap, name: "Energia Infinita", description: "Gerou 1GW de energia limpa" },
  { icon: Award, name: "Veterano Eco", description: "Jogou por 30 dias consecutivos" }
];

export default function Games() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % games.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Dados de Experiência
  const xp = 2350;
  const xpNext = 3000;
  const level = 7;
  const progressPercentage = (xp / xpNext) * 100;

  const featuredGame = games[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 text-gray-800 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* PARTE SUPERIOR: CAROUSEL E DESTAQUE */}
        <div className="flex gap-8 flex-col lg:flex-row">
          {/* CAROUSEL */}
          <div className="lg:w-[70%] w-full">
            <Card className="rounded-[2.5rem] overflow-hidden bg-white border border-emerald-100 shadow-xl">
              <div className="relative h-[450px] md:h-[520px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={games[currentSlide].image}
                      alt={games[currentSlide].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                      <motion.h2 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl font-black tracking-tight text-white mb-2"
                      >
                        {games[currentSlide].title}
                      </motion.h2>
                      <p className="text-emerald-50 text-sm max-w-xl opacity-90 leading-relaxed">
                        {games[currentSlide].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + games.length) % games.length)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-4 shadow-2xl z-10 transition-transform active:scale-90"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % games.length)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-4 shadow-2xl z-10 transition-transform active:scale-90"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* THUMBNAILS */}
              <div className="flex gap-4 p-6 overflow-x-auto bg-emerald-50/30 backdrop-blur-sm">
                {games.map((game, index) => (
                  <div
                    key={game.id}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      "relative cursor-pointer rounded-2xl overflow-hidden min-w-[120px] h-[75px] transition-all duration-300",
                      index === currentSlide
                        ? "ring-4 ring-emerald-500 scale-105 shadow-lg"
                        : "opacity-40 hover:opacity-100"
                    )}
                  >
                    <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* FEATURED / SIDEBAR */}
          <div className="lg:w-[30%] w-full">
            <Card className="h-full rounded-[2.5rem] bg-white border border-emerald-100 shadow-xl p-8 flex flex-col justify-between">
              <div>
                <Badge className="bg-amber-100 text-amber-700 border-none px-4 py-1.5 rounded-full mb-6">
                  <Star size={14} className="mr-2 fill-amber-500 text-amber-500" /> 
                  Sugestão do Dia
                </Badge>

                <div className="flex flex-col items-center text-center gap-6 py-4">
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-inner">
                    {React.createElement(featuredGame.icon, {
                      size: 48,
                      className: "text-emerald-700"
                    })}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                      {featuredGame.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed px-4">
                      {featuredGame.description}
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-100 hover:-translate-y-1">
                <Gamepad2 size={22} />
                Jogar Agora
              </button>
            </Card>
          </div>
        </div>

        {/* PARTE INFERIOR: DASHBOARD DE PROGRESSÃO (EXPERIÊNCIA E CONQUISTAS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* BARRA DE EXPERIÊNCIA */}
          <Card className="rounded-[2rem] bg-white border border-emerald-100 shadow-lg p-6 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-emerald-200">
                  {level}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Seu Nível</h3>
                  <p className="text-sm text-emerald-600 font-medium">{xp} / {xpNext} XP</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                Faltam {xpNext - xp} XP
              </Badge>
            </div>
            <div className="relative h-5 w-full bg-gray-100 rounded-full overflow-hidden p-1 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.2, ease: "circOut" }}
                className="absolute h-full top-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
              />
            </div>
          </Card>

          {/* BARRA DE CONQUISTAS */}
          <Card className="rounded-[2rem] bg-white border border-emerald-100 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy size={20} className="text-amber-500" />
                <h3 className="font-bold text-gray-900 text-lg">Conquistas Recentes</h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                {badges.length} Desbloqueadas
              </span>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <TooltipProvider delayDuration={0}>
                {badges.map((badge, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <motion.div 
                        whileHover={{ y: -5, scale: 1.1 }}
                        className="flex-shrink-0 bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl cursor-help transition-colors hover:bg-emerald-100"
                      >
                        {React.createElement(badge.icon, {
                          size: 26,
                          className: "text-emerald-700"
                        })}
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-gray-900 text-white border-none p-3 rounded-xl shadow-2xl max-w-[200px]">
                      <p className="font-bold text-emerald-400">{badge.name}</p>
                      <p className="text-xs leading-tight mt-1">{badge.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}