import React, { useState } from "react";
import { motion } from "framer-motion";
import { Puzzle, Skull, Bug } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const donutData = [
  { name: "Pecuária", value: 41, color: "hsl(0 60% 50%)" },
  { name: "Agricultura", value: 28, color: "hsl(45 75% 47%)" },
  { name: "Desmatamento", value: 18, color: "hsl(150 50% 30%)" },
  { name: "Outros", value: 13, color: "hsl(200 30% 50%)" },
];

export function ContradictionsSection() {
  const [showQuiz, setShowQuiz] = useState(false);
  const { isCompleted } = useQuiz();

  return (
    <section id="contradictions" className="section-height bg-background py-16 flex items-center">
      <div className="mx-auto max-w-5xl px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-foreground mb-2"
        >
          Problemas que Ninguém Fala
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mb-10 max-w-2xl text-lg"
        >
          Verdades incômodas sobre agrotóxicos e agropecuária predatória que afetam sua saúde e o meio ambiente.
        </motion.p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Agrotoxics info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="shadow rounded-xl bg-card p-6 border border-border"
            >
              <div className="row mb-3">
                <Skull className="h-8 w-8 text-destructive" />
                <h3 className="text-xl font-bold text-foreground">Agrotóxicos</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                O Brasil é o maior consumidor de agrotóxicos do mundo, usando mais de{" "}
                <strong className="text-foreground">500 mil toneladas por ano</strong>. Muitos desses produtos são
                proibidos na Europa e causam câncer, problemas neurológicos e contaminação de rios e solos.
              </p>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                <li>• 30% dos alimentos possuem resíduos de agrotóxicos acima do permitido</li>
                <li>• Trabalhadores rurais são os mais afetados</li>
                <li>• Contaminação da água atinge comunidades inteiras</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="shadow rounded-xl bg-card p-6 border border-border"
            >
              <div className="row mb-3">
                <Bug className="h-8 w-8 text-accent" />
                <h3 className="text-xl font-bold text-foreground">Agropecuária Predatória</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A pecuária extensiva é responsável por <strong className="text-foreground">80% do desmatamento</strong>{" "}
                na Amazônia. A produção de carne bovina gera mais emissões de gases de efeito estufa do que todo o
                setor de transportes mundial.
              </p>
            </motion.div>
          </div>

          {/* Donut chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="shadow rounded-xl bg-card p-6 border border-border"
          >
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">
              Uso do Solo no Brasil (%)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
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
            className={`shadow row gap-2 ${isCompleted(5) ? "bg-gold text-foreground hover:bg-gold/90" : ""}`}
            size="lg"
          >
            <Puzzle className="h-5 w-5" />
            {isCompleted(5) ? "Quiz Completo ✓" : "Responder Quiz"}
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showQuiz && <QuizModal sectionIndex={5} onClose={() => setShowQuiz(false)} />}
      </AnimatePresence>
    </section>
  );
}
