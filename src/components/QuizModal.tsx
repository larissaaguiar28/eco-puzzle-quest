import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions, useQuiz } from "@/contexts/QuizContext";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizModalProps {
  sectionIndex: number;
  onClose: () => void;
}

export function QuizModal({ sectionIndex, onClose }: QuizModalProps) {
  const quiz = quizQuestions[sectionIndex];
  const { markCompleted, isCompleted } = useQuiz();
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const alreadyDone = isCompleted(sectionIndex);

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === quiz.correctIndex) {
      markCompleted(sectionIndex);
    }
  };

  const correct = selected === quiz.correctIndex;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg rounded-xl bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {alreadyDone ? (
          <div className="text-center">
            <CheckCircle className="mx-auto mb-3 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-bold text-foreground">Você já completou este quiz!</h3>
            <p className="text-muted-foreground">A peça já foi adicionada ao seu quebra-cabeça.</p>
            <Button onClick={onClose} className="mt-4">
              Fechar
            </Button>
          </div>
        ) : (
          <>
            <div className="row mb-4">
              <HelpCircle className="h-6 w-6 text-gold" />
              <h3 className="text-lg font-bold text-foreground">Quiz: {quiz.section}</h3>
            </div>
            <p className="mb-6 text-foreground font-medium">{quiz.question}</p>
            <div className="space-y-3">
              {quiz.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                    answered && i === quiz.correctIndex
                      ? "border-primary bg-primary/10 text-foreground"
                      : answered && i === selected && !correct
                      ? "border-destructive bg-destructive/10 text-foreground"
                      : answered
                      ? "border-border text-muted-foreground opacity-50"
                      : "border-border text-foreground hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center"
              >
                {correct ? (
                  <div className="row justify-center text-primary">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-bold">Correto! Você ganhou uma peça do quebra-cabeça! 🧩</span>
                  </div>
                ) : (
                  <div className="row justify-center text-destructive">
                    <XCircle className="h-5 w-5" />
                    <span className="font-bold">Incorreto! Tente novamente mais tarde.</span>
                  </div>
                )}
                <Button onClick={onClose} className="mt-3">
                  Fechar
                </Button>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
