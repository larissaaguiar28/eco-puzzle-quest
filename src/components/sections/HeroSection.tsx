import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Wind, Droplets, Puzzle, CheckCircle2 } from "lucide-react";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";

interface EnergyCard {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
}

const energyCards: EnergyCard[] = [
  {
    icon: Sun,
    title: "Energia Solar",
    desc: "Aproveita a radiação solar para gerar eletricidade limpa e renovável.",
    color: "text-yellow-400",
  },
  {
    icon: Wind,
    title: "Energia Eólica",
    desc: "Usa a força dos ventos para produzir energia sem emissões de CO₂.",
    color: "text-blue-300",
  },
  {
    icon: Droplets,
    title: "Energia Hidrelétrica",
    desc: "Transforma o fluxo das águas em energia sustentável para milhões.",
    color: "text-cyan-400",
  },
];

export function HeroSection(): JSX.Element {
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const { isCompleted } = useQuiz();
  
  // O índice 0 representa a seção atual do quiz
  const completed = isCompleted(0);

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden py-20"
      style={{
        backgroundImage: "url('/images/floresta_bom.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay Dinâmico */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold tracking-tight md:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-emerald-200"
        >
          Impactos Ambientais
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-4 text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto text-gray-200 font-light"
        >
          A sustentabilidade não é apenas uma escolha, é uma necessidade. 
          Cada ação conta na preservação do nosso planeta.
        </motion.p>

        {/* Energy Cards com Glassmorphism */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {energyCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl p-8 border border-white/10 hover:border-white/30 transition-all shadow-2xl"
            >
              <card.icon className={`mx-auto mb-4 h-12 w-12 ${card.color} transition-transform group-hover:rotate-12`} />
              <h3 className="text-xl font-bold mb-2 tracking-wide">{card.title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA - O Botão Magnético/Chamativo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, type: "spring", stiffness: 100 }}
          className="mt-16"
        >
          <Button
            onClick={() => setShowQuiz(true)}
            size="lg"
            className={`
              relative group overflow-hidden px-10 py-8 rounded-full text-xl font-bold uppercase tracking-widest transition-all duration-500
              ${completed 
                ? "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-black shadow-[0_0_30px_rgba(251,191,36,0.4)]" 
                : "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-emerald-500/60"}
              border-none outline-none ring-offset-black focus:ring-2 ring-white
            `}
          >
            {/* Camada de brilho animado (Shimmer) */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />

            <div className="relative z-10 flex items-center gap-3">
              {completed ? (
                <>
                  <CheckCircle2 className="h-6 w-6 animate-bounce" />
                  <span>Conquista Desbloqueada!</span>
                </>
              ) : (
                <>
                  <Puzzle className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                  <span>Desafiar Conhecimento</span>
                </>
              )}
            </div>

            {/* Overlay de brilho no Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity duration-300" />
          </Button>

          {completed && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-amber-400 font-medium text-sm"
            >
              Parabéns! Você completou esta etapa.
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Seta para indicar que há mais conteúdo abaixo */}
      <motion.div 
        animate={{ y: [0, 10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent mx-auto" />
      </motion.div>

      <AnimatePresence>
        {showQuiz && (
          <QuizModal 
            sectionIndex={0} 
            onClose={() => setShowQuiz(false)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}