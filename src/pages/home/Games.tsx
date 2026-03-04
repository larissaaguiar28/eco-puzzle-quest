import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  Zap,
  Award
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Badge = {
  name: string;
  icon: React.ReactNode;
};

type Game = {
  id: number;
  title: string;
  description: string;
  image: string;
  level: number;
  xp: number;
  badges: Badge[];
};

const games: Game[] = [
  {
    id: 1,
    title: "Eco Runner",
    description:
      "Corra pela floresta coletando energia limpa e salvando a natureza dos poluentes.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    level: 12,
    xp: 2450,
    badges: [
      { name: "Explorador", icon: <Star size={18} /> },
      { name: "Guardião", icon: <Shield size={18} /> },
      { name: "Energia Verde", icon: <Zap size={18} /> }
    ]
  },
  {
    id: 2,
    title: "Ocean Defender",
    description:
      "Proteja os oceanos recolhendo resíduos e restaurando a vida marinha.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    level: 8,
    xp: 1320,
    badges: [
      { name: "Protetor Azul", icon: <Shield size={18} /> },
      { name: "Mestre das Águas", icon: <Award size={18} /> }
    ]
  },
  {
    id: 3,
    title: "Solar City",
    description:
      "Construa uma cidade sustentável utilizando energia solar e tecnologias limpas.",
    image:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    level: 15,
    xp: 3890,
    badges: [
      { name: "Visionário", icon: <Star size={18} /> },
      { name: "Engenheiro Verde", icon: <Award size={18} /> }
    ]
  }
];

export default function GameGallery() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % games.length);

  const prevSlide = () =>
    setCurrentSlide((prev) =>
      prev === 0 ? games.length - 1 : prev - 1
    );

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeGame = games[currentSlide];

  const xpPercentage = (activeGame.xp % 1000) / 10;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-green-700 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">

        {/* CARROSSEL */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeGame.id}
              src={activeGame.image}
              alt={activeGame.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
            />
          </AnimatePresence>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full backdrop-blur-md"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-full backdrop-blur-md"
          >
            <ChevronRight />
          </button>
        </div>

        {/* INFORMAÇÕES + EXPERIÊNCIA + INSÍGNIAS */}
        <Card className="bg-white/10 backdrop-blur-lg border-none text-white rounded-2xl shadow-2xl">
          <CardContent className="p-8 flex flex-col gap-6">

            <div>
              <h2 className="text-3xl font-bold mb-2">
                {activeGame.title}
              </h2>
              <p className="text-white/80">
                {activeGame.description}
              </p>
            </div>

            {/* EXPERIÊNCIA */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Nível {activeGame.level}</span>
                <span>{activeGame.xp} XP</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div
                  key={activeGame.id}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-green-400"
                />
              </div>
            </div>

            {/* INSÍGNIAS */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Insígnias
              </h3>
              <div className="flex flex-wrap gap-3">
                {activeGame.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full text-sm"
                  >
                    {badge.icon}
                    {badge.name}
                  </div>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}