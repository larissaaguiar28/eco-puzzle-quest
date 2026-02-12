import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sprout, Recycle, Zap, Leaf, Puzzle, ChevronLeft, ChevronRight, TreePine, Bike, ShoppingBag, Lightbulb } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";

const practices = [
  { icon: Sprout, title: "Replantio", desc: "Participe de programas de reflorestamento e plante árvores nativas para restaurar ecossistemas degradados.", color: "text-primary" },
  { icon: Zap, title: "Consumo Eficiente", desc: "Reduza o consumo de energia com hábitos sustentáveis como usar lâmpadas LED e desligar aparelhos em standby.", color: "text-accent" },
  { icon: Recycle, title: "Reciclagem", desc: "Separe o lixo corretamente e dê nova vida aos materiais descartados, reduzindo o volume de resíduos em aterros.", color: "text-primary" },
  { icon: Leaf, title: "Consumo Consciente", desc: "Prefira produtos orgânicos e de origem sustentável, valorizando práticas de comércio justo.", color: "text-accent" },
  { icon: TreePine, title: "Preservação Florestal", desc: "Apoie iniciativas de conservação de florestas e combate ao desmatamento ilegal.", color: "text-primary" },
  { icon: Bike, title: "Mobilidade Verde", desc: "Use bicicleta, transporte público ou caronas compartilhadas para reduzir emissões de CO₂.", color: "text-accent" },
  { icon: ShoppingBag, title: "Compras Sustentáveis", desc: "Leve suas próprias sacolas, evite embalagens desnecessárias e prefira produtos locais.", color: "text-primary" },
  { icon: Lightbulb, title: "Educação Ambiental", desc: "Compartilhe conhecimento sobre sustentabilidade com família, amigos e comunidade.", color: "text-accent" },
];

const CARDS_PER_PAGE = 4;

export function PracticesSection() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [page, setPage] = useState(0);
  const { isCompleted } = useQuiz();

  const totalPages = Math.ceil(practices.length / CARDS_PER_PAGE);
  const currentCards = practices.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);

  return (
    <section id="practices" className="section-height bg-card py-16 flex items-center">
      <div className="mx-auto max-w-5xl px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-extrabold text-foreground mb-2 text-center"
        >
          Boas Práticas Sustentáveis
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-center mb-10 max-w-xl mx-auto"
        >
          Pequenas ações no dia a dia fazem grande diferença para o futuro do planeta.
        </motion.p>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {currentCards.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="shadow rounded-xl bg-background p-5 border border-border text-center"
                >
                  <p.icon className={`mx-auto mb-3 h-10 w-10 ${p.color}`} />
                  <h4 className="font-bold text-foreground text-sm">{p.title}</h4>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          <div className="row justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="row gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === page ? "w-6 bg-primary" : "w-2.5 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quiz */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Button
            onClick={() => setShowQuiz(true)}
            className={`shadow row gap-2 ${isCompleted(3) ? "bg-gold text-foreground hover:bg-gold/90" : ""}`}
            size="lg"
          >
            <Puzzle className="h-5 w-5" />
            {isCompleted(3) ? "Quiz Completo ✓" : "Responder Quiz"}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showQuiz && <QuizModal sectionIndex={3} onClose={() => setShowQuiz(false)} />}
      </AnimatePresence>
    </section>
  );
}
