import React, { useState } from "react";
import { motion } from "framer-motion";
import { Thermometer, Heart, Fish, AlertTriangle, Puzzle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";

const climateCards = [
  {
    icon: Thermometer,
    title: "Aumento de Temperatura",
    desc: "A temperatura média global já subiu 1.1°C desde a era pré-industrial. Até 2100, pode subir até 4°C.",
    stat: "+1.1°C",
  },
  {
    icon: Heart,
    title: "Riscos à Saúde Humana",
    desc: "Ondas de calor, doenças respiratórias e propagação de doenças tropicais ameaçam bilhões de pessoas.",
    stat: "7M mortes/ano",
  },
  {
    icon: Fish,
    title: "Vida Marinha em Perigo",
    desc: "O branqueamento de corais e a acidificação dos oceanos ameaçam 25% de todas as espécies marinhas.",
    stat: "50% corais perdidos",
  },
  {
    icon: AlertTriangle,
    title: "Nível do Mar",
    desc: "O nível do mar sobe 3.6mm/ano, ameaçando 680 milhões de pessoas em áreas costeiras.",
    stat: "+26cm desde 1880",
  },
];

export function ClimateSection() {
  const [showQuiz, setShowQuiz] = useState(false);
  const { isCompleted } = useQuiz();

  return (
    <section id="climate" className="section-height bg-primary py-16 flex items-center">
      <div className="mx-auto max-w-5xl px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-primary-foreground mb-2"
        >
          Mudanças Climáticas & Saúde
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-primary-foreground/80 mb-10 max-w-2xl text-lg"
        >
          As mudanças climáticas não são um problema do futuro — elas já estão afetando sua saúde,
          a vida marinha e o equilíbrio do planeta.
        </motion.p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {climateCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.03 }}
              className="shadow rounded-xl bg-primary-foreground/10 backdrop-blur p-6 border border-primary-foreground/20"
            >
              <div className="row mb-3">
                <card.icon className="h-8 w-8 text-gold" />
                <span className="ml-auto text-2xl font-extrabold text-gold">{card.stat}</span>
              </div>
              <h3 className="text-lg font-bold text-primary-foreground">{card.title}</h3>
              <p className="mt-2 text-sm text-primary-foreground/80">{card.desc}</p>
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
            variant="secondary"
            className={`shadow row gap-2 ${isCompleted(2) ? "bg-gold text-foreground hover:bg-gold/90" : ""}`}
            size="lg"
          >
            <Puzzle className="h-5 w-5" />
            {isCompleted(2) ? "Quiz Completo ✓" : "Responder Quiz"}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showQuiz && <QuizModal sectionIndex={2} onClose={() => setShowQuiz(false)} />}
      </AnimatePresence>
    </section>
  );
}
