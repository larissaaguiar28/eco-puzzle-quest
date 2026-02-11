import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuiz } from "@/contexts/QuizContext";
import { Puzzle, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PuzzlePanel() {
  const { totalPieces, showCongrats, dismissCongrats } = useQuiz();
  const pieces = Array.from({ length: 6 }, (_, i) => i < totalPieces);

  return (
    <>
      {/* Floating puzzle indicator */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="shadow rounded-full bg-primary p-3 flex items-center gap-2 text-primary-foreground">
          <Puzzle className="h-5 w-5" />
          <span className="font-bold text-sm">{totalPieces}/6</span>
        </div>
        {/* Mini puzzle grid */}
        <div className="mt-2 grid grid-cols-3 gap-1">
          {pieces.map((filled, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={filled ? { scale: [0.5, 1.2, 1], opacity: 1 } : { opacity: 0.2 }}
              className={`h-6 w-6 rounded-sm ${
                filled ? "bg-gold" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Congratulations modal */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="max-w-md rounded-2xl bg-card p-8 text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <Globe className="mx-auto h-24 w-24 text-primary" />
              </motion.div>
              <h2 className="mt-4 text-3xl font-bold text-foreground">
                🌍 Parabéns!
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Você completou todas as 6 peças do quebra-cabeça do Planeta Terra!
                Agora você é um verdadeiro defensor da sustentabilidade.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 mx-auto max-w-[120px]">
                {pieces.map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="h-10 w-10 rounded-md bg-gold"
                  />
                ))}
              </div>
              <Button onClick={dismissCongrats} className="mt-6" size="lg">
                Continuar Explorando
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
