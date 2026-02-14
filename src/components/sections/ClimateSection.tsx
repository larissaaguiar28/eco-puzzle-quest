"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Thermometer, 
  Heart, 
  Fish, 
  AlertTriangle, 
  Leaf, 
  CheckCircle2, 
  type LucideIcon 
} from "lucide-react";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";

interface ClimateCard {
  icon: LucideIcon;
  title: string;
  desc: string;
  stat: string;
  color: string;
}

const climateCards: ClimateCard[] = [
  {
    icon: Thermometer,
    title: "Aquecimento Global",
    desc: "A temperatura média global subiu 1.1°C. Precisamos limitar o aquecimento a 1.5°C para evitar desastres.",
    stat: "+1.1°C",
    color: "text-emerald-400",
  },
  {
    icon: Heart,
    title: "Qualidade do Ar",
    desc: "A poluição e o calor extremo reduzem a expectativa de vida e aumentam doenças respiratórias.",
    stat: "Proteja-se",
    color: "text-green-400",
  },
  {
    icon: Fish,
    title: "Oceanos Saudáveis",
    desc: "Oceanos absorvem 90% do calor excessivo. O equilíbrio marinho é vital para o oxigênio que respiramos.",
    stat: "90% calor",
    color: "text-teal-400",
  },
  {
    icon: AlertTriangle,
    title: "Biodiversidade",
    desc: "A perda de habitats acelera a extinção de espécies. Preservar é manter a engrenagem da vida.",
    stat: "Preserve",
    color: "text-lime-400",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  },
};

export function ClimateSection() {
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const quizContext = useQuiz();
  const completed = quizContext?.isCompleted ? quizContext.isCompleted(2) : false;

  return (
    <section id="climate" className="relative min-h-screen bg-[#06120e] py-24 flex items-center overflow-hidden">
      {/* Elementos Orgânicos de Fundo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-green-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-6xl px-6 relative z-10">
        <header className="mb-20 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center md:justify-start gap-2 mb-4"
          >
            <Leaf className="text-emerald-500 h-5 w-5" />
            <span className="text-emerald-500 font-mono text-xs tracking-[0.3em] uppercase">
              Consciência Ecológica
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-slate-50 mb-6 leading-[1.1]"
          >
            Sustentabilidade <br /> & <span className="text-emerald-500">Futuro Comum</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 max-w-2xl text-lg leading-relaxed"
          >
            A preservação ambiental não é apenas sobre o planeta, é sobre a nossa 
            sobrevivência. Entenda os pilares que sustentam a vida na Terra.
          </motion.p>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {climateCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -12 }}
                className="group relative p-8 rounded-3xl bg-emerald-950/20 border border-emerald-900/30 backdrop-blur-xl hover:border-emerald-500/50 transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 ${card.color}`}>
                    <Icon size={28} />
                  </div>
                  <span className="text-sm font-bold text-emerald-500/60 uppercase tracking-widest">
                    {card.stat}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-100 mb-4">{card.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">
                  {card.desc}
                </p>
                
                {/* Glow Effect no Hover */}
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl blur opacity-0 group-hover:opacity-10 transition duration-500" />
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-24 flex flex-col items-center gap-6"
        >
          <Button
            onClick={() => setShowQuiz(true)}
            size="lg"
            className={`
              relative h-16 px-14 text-lg font-bold transition-all duration-500 rounded-full gap-3
              ${completed 
                ? "bg-transparent border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500/10" 
                : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105"
              }
            `}
          >
            {completed ? (
              <>
                <CheckCircle2 className="h-6 w-6" />
                <span>Módulo Concluído</span>
              </>
            ) : (
              <>
                <Leaf className="h-6 w-6" />
                <span>Agir Agora</span>
              </>
            )}
          </Button>
          <p className="text-emerald-900/60 font-mono text-[10px] tracking-[0.4em] uppercase">
            Sua ação faz a diferença
          </p>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {showQuiz && (
          <QuizModal 
            sectionIndex={2} 
            onClose={() => setShowQuiz(false)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}