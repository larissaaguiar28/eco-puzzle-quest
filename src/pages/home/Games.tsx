import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2, TreePine, Recycle, Droplets, Wind, Leaf, Sun, Star,
  ChevronLeft, ChevronRight, Shield, Zap, Award
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const games = [
  {
    id: 1,
    title: "Guardião da Floresta",
    description: "Proteja a Amazônia de ameaças ambientais em um jogo de estratégia imersivo.",
    icon: TreePine,
    color: "from-emerald-900/80 to-emerald-600/20",
  },
  {
    id: 2,
    title: "Recicla Quest",
    description: "Separe e recicle materiais corretamente em desafios cronometrados.",
    icon: Recycle,
    color: "from-blue-900/80 to-blue-600/20",
  },
  {
    id: 3,
    title: "Oceano Limpo",
    description: "Navegue pelos oceanos removendo poluentes e salvando a vida marinha.",
    icon: Droplets,
    color: "from-cyan-900/80 to-cyan-600/20",
  },
  {
    id: 4,
    title: "Energia Verde",
    description: "Construa e gerencie uma cidade sustentável movida a energias renováveis.",
    icon: Wind,
    color: "from-teal-900/80 to-teal-600/20",
  },
];

const badges = [
  { icon: TreePine, name: "Guardião da Floresta", description: "Completou 10 missões de reflorestamento" },
  { icon: Recycle, name: "Mestre da Reciclagem", description: "Reciclou 500 itens corretamente" },
  { icon: Droplets, name: "Protetor dos Oceanos", description: "Limpou 3 oceanos virtuais" },
  { icon: Leaf, name: "Eco Iniciante", description: "Completou o tutorial inicial" },
  { icon: Sun, name: "Solar Champion", description: "Instalou 100 painéis solares" },
  { icon: Shield, name: "Defensor Ambiental", description: "Bloqueou 50 ameaças ao meio ambiente" },
  { icon: Zap, name: "Energia Infinita", description: "Gerou 1GW de energia limpa" },
  { icon: Award, name: "Veterano Eco", description: "Jogou por 30 dias consecutivos" },
];

export default function Games() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredGame = games[(currentSlide + 1) % games.length];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((p) => (p + 1) % games.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const xp = 2350;
  const xpNext = 3000;
  const level = 7;

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Hero: Carousel + Featured */}
      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Carousel (60%) */}
        <div className="lg:w-[60%] w-full">
          <Card className="border-border rounded-2xl overflow-hidden">
            <div className="relative h-[340px] bg-muted">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center bg-muted"
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-t", games[currentSlide].color)} />
                  {React.createElement(games[currentSlide].icon, {
                    size: 80,
                    className: "text-muted-foreground/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                  })}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                    <h2 className="text-2xl font-bold drop-shadow-lg">{games[currentSlide].title}</h2>
                    <p className="text-sm opacity-90 mt-1 drop-shadow">{games[currentSlide].description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Nav arrows */}
              <button
                onClick={() => setCurrentSlide((p) => (p - 1 + games.length) % games.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-background/60 hover:bg-background/80 rounded-full p-2 transition-colors"
              >
                <ChevronLeft size={20} className="text-foreground" />
              </button>
              <button
                onClick={() => setCurrentSlide((p) => (p + 1) % games.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-background/60 hover:bg-background/80 rounded-full p-2 transition-colors"
              >
                <ChevronRight size={20} className="text-foreground" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 py-3 bg-card">
              {games.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    i === currentSlide ? "bg-primary scale-125" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Featured game (40%) */}
        <div className="lg:w-[40%] w-full">
          <Card className="border-border rounded-2xl h-full overflow-hidden group hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
              <Badge variant="secondary" className="w-fit text-[10px]">
                <Star size={12} className="mr-1" /> Em Destaque
              </Badge>
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {React.createElement(featuredGame.icon, { size: 32, className: "text-primary" })}
                </div>
                <h3 className="text-xl font-bold text-foreground">{featuredGame.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{featuredGame.description}</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted rounded-lg p-3">
                <Gamepad2 size={16} />
                <span className="font-medium">Em breve disponível</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Player Profile + Badges */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Player Profile */}
        <Card className="border-border rounded-2xl">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">UE</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">Usuário EcoS</h3>
                <p className="text-sm text-muted-foreground">Jogador desde fevereiro de 2026</p>
              </div>
              <Badge className="text-xs">Nível {level}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>XP: {xp.toLocaleString()} / {xpNext.toLocaleString()}</span>
                <span>{Math.round((xp / xpNext) * 100)}%</span>
              </div>
              <Progress value={(xp / xpNext) * 100} className="h-3" />
              <p className="text-[11px] text-muted-foreground">
                Faltam {(xpNext - xp).toLocaleString()} XP para o Nível {level + 1}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="border-border rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Insígnias</h3>
            <TooltipProvider delayDuration={200}>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {badges.map((badge) => (
                  <Tooltip key={badge.name}>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 hover:border-primary/50 transition-colors">
                          {React.createElement(badge.icon, { size: 24, className: "text-primary" })}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium text-center w-16 truncate">
                          {badge.name}
                        </span>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-semibold">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
