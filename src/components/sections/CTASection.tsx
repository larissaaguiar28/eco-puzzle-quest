import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sprout, Recycle, Zap, Leaf, Puzzle, LogIn, UserPlus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const practices = [
  { icon: Sprout, title: "Replantio", desc: "Participe de programas de reflorestamento e plante árvores." },
  { icon: Zap, title: "Consumo Eficiente", desc: "Reduza o consumo de energia com hábitos sustentáveis." },
  { icon: Recycle, title: "Reciclagem", desc: "Separe o lixo e dê nova vida aos materiais descartados." },
  { icon: Leaf, title: "Consumo Consciente", desc: "Prefira produtos orgânicos e de origem sustentável." },
];

export function CTASection() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [formMode, setFormMode] = useState<"login" | "register">("login");
  const { isCompleted } = useQuiz();

  return (
    <section id="cta" className="section-height bg-card py-16 flex items-center">
      <div className="mx-auto max-w-5xl px-6 w-full">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="shadow rounded-xl bg-background p-8 border border-border"
          >
            <div className="row mb-6 gap-2">
              <Button
                variant={formMode === "login" ? "default" : "ghost"}
                onClick={() => setFormMode("login")}
                className="row gap-1"
              >
                <LogIn className="h-4 w-4" /> Entrar
              </Button>
              <Button
                variant={formMode === "register" ? "default" : "ghost"}
                onClick={() => setFormMode("register")}
                className="row gap-1"
              >
                <UserPlus className="h-4 w-4" /> Registrar
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={formMode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {formMode === "register" && (
                  <div className="mb-4">
                    <label className="text-sm font-medium text-foreground">Nome</label>
                    <Input placeholder="Seu nome completo" className="mt-1" />
                  </div>
                )}
                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input type="email" placeholder="seu@email.com" className="mt-1" />
                </div>
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground">Senha</label>
                  <Input type="password" placeholder="••••••••" className="mt-1" />
                </div>
                <Button className="w-full shadow" size="lg">
                  {formMode === "login" ? "Entrar na Plataforma" : "Criar Conta"}
                </Button>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Practices */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-extrabold text-foreground mb-6"
            >
              Boas Práticas Sustentáveis
            </motion.h2>
            <div className="grid grid-cols-2 gap-4">
              {practices.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="shadow rounded-lg bg-background p-4 border border-border text-center"
                >
                  <p.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <h4 className="font-bold text-foreground text-sm">{p.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
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
