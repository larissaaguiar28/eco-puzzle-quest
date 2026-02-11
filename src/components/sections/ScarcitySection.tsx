import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TreePine, Droplets, Factory, Puzzle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
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
    <div ref={ref} className="text-4xl font-extrabold text-primary-foreground">
      {count}
      {suffix}
    </div>
  );
}

const stats = [
  { icon: TreePine, value: 10, suffix: "M", label: "hectares de floresta perdidos/ano", desc: "Equivalente a 27 campos de futebol por minuto" },
  { icon: Droplets, value: 40, suffix: "%", label: "da população sofrerá escassez hídrica até 2050", desc: "O consumo triplicou nos últimos 50 anos" },
  { icon: Factory, value: 75, suffix: "%", label: "das emissões vêm de combustíveis fósseis", desc: "A indústria precisa mudar urgentemente" },
];

export function ScarcitySection() {
  const [showQuiz, setShowQuiz] = useState(false);
  const { isCompleted } = useQuiz();

  return (
    <section
      id="scarcity"
      className="relative section-height flex items-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/floresta_ruim.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 w-full">
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-white mb-2"
        >
          Escassez & Desmatamento
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/80 mb-10 max-w-2xl text-lg"
        >
          Os dados não mentem: o consumo excessivo e o desmatamento estão colocando nosso planeta em risco.
          É hora de agir com informação e consciência.
        </motion.p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="shadow rounded-xl bg-white/10 backdrop-blur-md p-6 text-center text-white border border-white/20"
            >
              <stat.icon className="mx-auto mb-3 h-10 w-10 text-gold" />
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm font-semibold opacity-90">{stat.label}</p>
              <p className="mt-1 text-xs opacity-70">{stat.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <Button
            onClick={() => setShowQuiz(true)}
            className={`shadow row gap-2 ${isCompleted(1) ? "bg-gold hover:bg-gold/90" : ""}`}
            size="lg"
          >
            <Puzzle className="h-5 w-5" />
            {isCompleted(1) ? "Quiz Completo ✓" : "Responder Quiz"}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showQuiz && <QuizModal sectionIndex={1} onClose={() => setShowQuiz(false)} />}
      </AnimatePresence>
    </section>
  );
}
