import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Puzzle, Thermometer, Globe, Recycle, TreePine, Flame, Sun } from "lucide-react";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";

const timelineEvents = [
  { year: "1970", title: "Revolução Industrial Acelerada", desc: "Emissões de CO₂ industriais triplicam em 20 anos.", icon: Flame, shade: "bg-primary" },
  { year: "1988", title: "Criação do IPCC", desc: "Painel Intergovernamental sobre Mudanças Climáticas é estabelecido.", icon: Globe, shade: "bg-forest" },
  { year: "1992", title: "Rio 92 - Eco Summit", desc: "Cúpula da Terra reúne 172 países para discutir sustentabilidade.", icon: TreePine, shade: "bg-primary" },
  { year: "2004", title: "Pico do Desmatamento", desc: "Amazônia perde 27.772 km² — o pior registro da história.", icon: Thermometer, shade: "bg-forest" },
  { year: "2015", title: "Acordo de Paris", desc: "195 países se comprometem a limitar o aquecimento a 1.5°C.", icon: Recycle, shade: "bg-primary" },
  { year: "2023", title: "Ano Mais Quente", desc: "Temperaturas 1.48°C acima da média pré-industrial.", icon: Sun, shade: "bg-forest" },
];

function Leaf({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 60"
      className={`w-6 h-9 ${className ?? ""}`}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      fill="currentColor"
    >
      <path d="M20 0 C10 15 0 30 0 45 C0 53 9 60 20 60 C31 60 40 53 40 45 C40 30 30 15 20 0Z" />
      <line x1="20" y1="10" x2="20" y2="55" stroke="hsl(var(--background))" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

export function TimelineSection() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { isCompleted } = useQuiz();

  return (
    <section id="timeline" className="section-height bg-secondary py-16 flex items-center overflow-hidden">
      <div className="mx-auto max-w-3xl px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-secondary-foreground mb-12 text-center"
        >
          Linha do Tempo Ambiental
        </motion.h2>

        {/* Tree timeline */}
        <div className="relative flex flex-col items-center">
          {/* Ground */}
          <div className="order-last mt-2 flex flex-col items-center">
            <div className="w-3 h-10 bg-accent rounded-sm" />
            <div className="w-28 h-1 bg-accent rounded-full" />
            <div className="flex gap-1 mt-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-3 h-0.5 bg-accent/60 rounded-full -rotate-45" />
              ))}
            </div>
          </div>

          {/* Events as tree nodes */}
          <div className="flex flex-col items-center gap-0">
            {timelineEvents.map((event, i) => {
              const isLeft = i % 2 === 0;
              const IconComp = event.icon;
              const isActive = activeIndex === i;
              const size = i === timelineEvents.length - 1 ? "w-28 h-28" : "w-24 h-24";

              return (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (timelineEvents.length - 1 - i) * 0.12 }}
                  className="relative flex items-center w-full"
                  style={{ justifyContent: isLeft ? "flex-start" : "flex-end" }}
                >
                  {/* Connector vine to center */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-primary/30 z-0" />

                  {/* Branch */}
                  <div
                    className={`flex items-center gap-0 z-10 ${isLeft ? "flex-row-reverse" : "flex-row"}`}
                    style={{ marginLeft: isLeft ? "0" : "auto", marginRight: isLeft ? "auto" : "0" }}
                  >
                    {/* Leaves decoration */}
                    <div className={`flex flex-col items-center gap-0.5 ${isLeft ? "mr-1" : "ml-1"}`}>
                      <Leaf className="text-primary opacity-70" flip={!isLeft} />
                      <Leaf className="text-forest opacity-50 -mt-3" flip={isLeft} />
                    </div>

                    {/* Branch line */}
                    <div className={`h-1 w-8 md:w-16 ${event.shade} rounded-full opacity-60`} />

                    {/* Circle node */}
                    <motion.button
                      onClick={() => setActiveIndex(isActive ? null : i)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative ${size} rounded-full ${event.shade} border-4 border-secondary flex flex-col items-center justify-center cursor-pointer shadow transition-shadow ${
                        isActive ? "ring-4 ring-gold" : ""
                      }`}
                    >
                      <IconComp className="h-6 w-6 text-primary-foreground mb-1" />
                      <span className="text-sm font-extrabold text-primary-foreground">{event.year}</span>
                    </motion.button>

                    {/* Branch line other side */}
                    <div className={`h-1 w-4 md:w-8 ${event.shade} rounded-full opacity-40`} />

                    {/* Small icon badge */}
                    <div className={`w-8 h-8 rounded-full bg-gold flex items-center justify-center shadow`}>
                      <IconComp className="h-4 w-4 text-gold-foreground" />
                    </div>
                  </div>

                  {/* Info popup */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        className={`absolute z-20 top-full mt-2 ${
                          isLeft ? "left-4" : "right-4"
                        } bg-card border border-border rounded-lg p-4 shadow max-w-[250px]`}
                      >
                        <h4 className="font-bold text-foreground text-sm">{event.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{event.desc}</p>
                        <Leaf className="absolute -top-3 text-primary opacity-40 w-4 h-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quiz button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center"
        >
          <Button
            onClick={() => setShowQuiz(true)}
            className={`shadow row gap-2 ${isCompleted(4) ? "bg-gold text-foreground hover:bg-gold/90" : ""}`}
            size="lg"
          >
            <Puzzle className="h-5 w-5" />
            {isCompleted(4) ? "Quiz Completo ✓" : "Responder Quiz"}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showQuiz && <QuizModal sectionIndex={4} onClose={() => setShowQuiz(false)} />}
      </AnimatePresence>
    </section>
  );
}
