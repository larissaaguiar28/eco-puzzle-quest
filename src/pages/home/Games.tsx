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
  LucideIcon // <- Importado para usar na tipagem
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

// --- TIPAGENS DO TYPESCRIPT ---
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
// ------------------------------

const games: Game[] = [
  {
    id: 1,
    title: "Guardião da Floresta",
    description:
      "Proteja a Amazônia de ameaças ambientais em um jogo de estratégia imersivo.",
    icon: TreePine,
    image: "https://images.unsplash.com/photo-1508780709619-79562169bc64"
  },
  {
    id: 2,
    title: "Recicla Quest",
    description:
      "Separe e recicle materiais corretamente em desafios cronometrados.",
    icon: Recycle,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b"
  },
  {
    id: 3,
    title: "Oceano Limpo",
    description:
      "Navegue pelos oceanos removendo poluentes e salvando a vida marinha.",
    icon: Droplets,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    id: 4,
    title: "Energia Verde",
    description:
      "Construa e gerencie uma cidade sustentável movida a energias renováveis.",
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

  const xp = 2350;
  const xpNext = 3000;
  const level = 7;

  // ✅ Corrigido — agora é o mesmo jogo do slide
  const featuredGame = games[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 text-gray-800">
      <div className="p-8 space-y-10 max-w-7xl mx-auto">
        <div className="flex gap-8 flex-col lg:flex-row">

          {/* CAROUSEL */}
          <div className="lg:w-[70%] w-full">
            <Card className="rounded-3xl overflow-hidden bg-white border border-emerald-100 shadow-lg">
              <div className="relative h-[560px]">

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

                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50 to-transparent">
                      <h2 className="text-4xl font-extrabold tracking-tight text-white">
                        {games[currentSlide].title}
                      </h2>
                      <p className="mt-3 text-sm text-gray-200 max-w-xl">
                        {games[currentSlide].description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + games.length) % games.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % games.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* THUMBNAILS */}
              <div className="flex gap-3 p-5 overflow-x-auto bg-emerald-50">
                {games.map((game, index) => (
                  <div
                    key={game.id}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      "relative cursor-pointer rounded-2xl overflow-hidden min-w-[130px] h-[85px] transition-all duration-300",
                      index === currentSlide
                        ? "ring-2 ring-emerald-300 scale-105"
                        : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

            </Card>
          </div>

          {/* FEATURED */}
          <div className="lg:w-[35%] w-full">
            <Card className="h-full rounded-3xl bg-white border border-emerald-100 shadow-lg">
              <CardContent className="p-8 flex flex-col justify-between h-full">

                <Badge className="w-fit bg-emerald-200 text-emerald-800 border-none">
                  <Star size={12} className="mr-1" /> Em Destaque
                </Badge>

                <div className="flex flex-col items-center text-center gap-4 py-8">
                  <div className="bg-emerald-100 w-20 h-20 rounded-3xl flex items-center justify-center">
                    {React.createElement(featuredGame.icon, {
                      size: 36,
                      className: "text-emerald-600"
                    })}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900">
                    {featuredGame.title}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {featuredGame.description}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs bg-emerald-50 rounded-xl p-3 text-emerald-700">
                  <Gamepad2 size={16} />
                  <span>Em breve disponível</span>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
}