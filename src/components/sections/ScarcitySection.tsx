import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { TreePine, Droplets, Factory, Puzzle, CheckCircle2 } from "lucide-react";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";

// --- Subcomponente do Contador Animado ---
interface CounterProps {
  end: number;
  suffix?: string;
}

function AnimatedCounter({ end, suffix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <div ref={ref} className="text-4xl font-extrabold text-white">
      {count}
      {suffix}
    </div>
  );
}

// --- Dados das Estatísticas ---
const stats = [
  { icon: TreePine, value: 10, suffix: "M", label: "hectares de floresta perdidos/ano", desc: "Equivalente a 27 campos de futebol por minuto", color: "text-emerald-400" },
  { icon: Droplets, value: 40, suffix: "%", label: "da população sofrerá escassez hídrica", desc: "Projeção crítica para o ano de 2050", color: "text-blue-400" },
  { icon: Factory, value: 75, suffix: "%", label: "das emissões vêm de combustíveis fósseis", desc: "A indústria precisa mudar urgentemente", color: "text-orange-400" },
];

export function ScarcitySection(): JSX.Element {
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const { isCompleted } = useQuiz();
  const completed = isCompleted(1); // Índice 1 para esta seção

  return (
    <section
      id="scarcity"
      className="relative min-h-screen flex items-center overflow-hidden py-20"
      style={{
        backgroundImage: "url('/images/floresta_ruim.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay mais escuro para focar nos dados de alerta */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 w-full">
        <div className="text-left mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight"
          >
            Escassez & <span className="text-orange-500">Desmatamento</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 max-w-2xl text-lg md:text-xl font-light"
          >
            Os dados não mentem: o consumo excessivo está colocando nosso planeta em risco. 
            É hora de transformar consciência em ação.
          </motion.p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative group overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md p-8 border border-white/10 hover:bg-white/10 transition-all shadow-2xl"
            >
              <stat.icon className={`mb-4 h-10 w-10 ${stat.color}`} />
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm font-bold text-white uppercase tracking-wider">{stat.label}</p>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">{stat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* BOTÃO CHAMATIVO (CTA) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex justify-center"
        >
          <Button
            onClick={() => setShowQuiz(true)}
            size="lg"
            className={`
              relative group overflow-hidden px-12 py-8 rounded-2xl text-xl font-black uppercase tracking-widest transition-all duration-500
              ${completed 
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" 
                : "bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:shadow-red-600/50"}
            `}
          >
            {/* Efeito de Reflexo (Shimmer) */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />

            <div className="relative z-10 flex items-center gap-4">
              {completed ? (
                <>
                  <CheckCircle2 className="h-7 w-7" />
                  <span>Conhecimento Provado</span>
                </>
              ) : (
                <>
                  <Puzzle className="h-7 w-7 group-hover:scale-110 transition-transform" />
                  <span>Aceitar Desafio</span>
                </>
              )}
            </div>

            {/* Brilho extra no hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-white/10 to-transparent transition-opacity" />
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showQuiz && (
          <QuizModal 
            sectionIndex={1} 
            onClose={() => setShowQuiz(false)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}