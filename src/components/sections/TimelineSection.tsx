import React, { useState } from "react";
import { motion } from "framer-motion";
import { Puzzle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";

const timelineEvents = [
  { year: "1970", title: "Revolução Industrial Acelerada", desc: "Emissões de CO₂ industriais triplicam em 20 anos, iniciando o aquecimento global moderno." },
  { year: "1988", title: "Criação do IPCC", desc: "Painel Intergovernamental sobre Mudanças Climáticas é estabelecido pela ONU." },
  { year: "1992", title: "Rio 92 - Eco Summit", desc: "Cúpula da Terra no Rio de Janeiro reúne 172 países para discutir sustentabilidade." },
  { year: "2004", title: "Pico do Desmatamento", desc: "Amazônia perde 27.772 km² em um ano — o pior registro da história." },
  { year: "2015", title: "Acordo de Paris", desc: "195 países se comprometem a limitar o aquecimento global a 1.5°C." },
  { year: "2023", title: "Ano Mais Quente", desc: "2023 é registrado como o ano mais quente da história, com temperaturas 1.48°C acima da média." },
];

export function TimelineSection() {
  const [showQuiz, setShowQuiz] = useState(false);
  const { isCompleted } = useQuiz();

  return (
    <section id="timeline" className="section-height bg-secondary py-16 flex items-center">
      <div className="mx-auto max-w-5xl px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-secondary-foreground mb-10 text-center"
        >
          Linha do Tempo Ambiental
        </motion.h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-border" />

          {timelineEvents.map((event, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative mb-8 flex items-center ${isLeft ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`w-5/12 ${isLeft ? "text-right pr-8" : "text-left pl-8"}`}>
                  <div className="shadow rounded-lg bg-card p-4 border border-border inline-block">
                    <span className="text-sm font-bold text-gold">{event.year}</span>
                    <h4 className="font-bold text-foreground">{event.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{event.desc}</p>
                  </div>
                </div>
                {/* Center dot */}
                <div className="absolute left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-gold border-2 border-card z-10" />
                <div className="w-5/12" />
              </motion.div>
            );
          })}
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
