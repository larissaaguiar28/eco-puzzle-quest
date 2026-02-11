import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Wind, Droplets, Puzzle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";

const energyCards = [
  {
    icon: Sun,
    title: "Energia Solar",
    desc: "Aproveita a radiação solar para gerar eletricidade limpa e renovável.",
  },
  {
    icon: Wind,
    title: "Energia Eólica",
    desc: "Usa a força dos ventos para produzir energia sem emissões de CO₂.",
  },
  {
    icon: Droplets,
    title: "Energia Hidrelétrica",
    desc: "Transforma o fluxo das águas em energia sustentável para milhões.",
  },
];

export function HeroSection() {
  const [showQuiz, setShowQuiz] = useState(false);
  const { isCompleted } = useQuiz();

  return (
    <section
      id="hero"
      className="relative section-height flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/floresta_bom.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold tracking-tight md:text-6xl"
        >
          Impactos Ambientais
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto opacity-90"
        >
          A sustentabilidade não é apenas uma escolha, é uma necessidade. Cada ação conta na
          preservação do nosso planeta para as futuras gerações. Juntos, podemos fazer a diferença.
        </motion.p>

        {/* Energy Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {energyCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="shadow rounded-xl bg-white/10 backdrop-blur-md p-6 text-center border border-white/20"
            >
              <card.icon className="mx-auto mb-3 h-10 w-10 text-gold" />
              <h3 className="text-lg font-bold">{card.title}</h3>
              <p className="mt-2 text-sm opacity-80">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Quiz button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Button
            onClick={() => setShowQuiz(true)}
            className={`shadow row gap-2 ${isCompleted(0) ? "bg-gold hover:bg-gold/90" : ""}`}
            size="lg"
          >
            <Puzzle className="h-5 w-5" />
            {isCompleted(0) ? "Quiz Completo ✓" : "Responder Quiz"}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showQuiz && <QuizModal sectionIndex={0} onClose={() => setShowQuiz(false)} />}
      </AnimatePresence>
    </section>
  );
}
