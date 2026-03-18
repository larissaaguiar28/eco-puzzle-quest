import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onExit: () => void;
  onXP: (amount: number) => void;
}

const QUESTIONS = [
  { q: "Qual fonte de energia utiliza a luz do sol para gerar eletricidade?", opts: ["Eólica", "Solar", "Nuclear", "Hidrelétrica"], correct: 1 },
  { q: "Turbinas eólicas convertem a energia do ______ em eletricidade.", opts: ["Calor", "Vento", "Água", "Carvão"], correct: 1 },
  { q: "Qual é considerada a fonte de energia mais limpa?", opts: ["Gás natural", "Petróleo", "Solar", "Carvão"], correct: 2 },
  { q: "O que significa a sigla 'kWh'?", opts: ["Quilowatt-hora", "Quilômetro-hora", "Quilovolt-hora", "Quiloampère-hora"], correct: 0 },
  { q: "Usinas hidrelétricas aproveitam a força da:", opts: ["Maré", "Água corrente", "Lava vulcânica", "Gravidade lunar"], correct: 1 },
  { q: "Biomassa é uma fonte de energia derivada de:", opts: ["Minerais", "Matéria orgânica", "Combustíveis fósseis", "Energia nuclear"], correct: 1 },
  { q: "Qual país lidera a produção mundial de energia eólica?", opts: ["Brasil", "Alemanha", "China", "EUA"], correct: 2 },
  { q: "O que é 'net zero' em termos de energia?", opts: ["Zero consumo", "Emissões líquidas zero", "Zero investimento", "Zero importação"], correct: 1 },
];

export default function EnergiaVerde({ onExit, onXP }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [litSectors, setLitSectors] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[currentQ];

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correct) {
      setLitSectors((prev) => [...prev, currentQ]);
      onXP(20);
    }
  };

  const handleNext = () => {
    if (currentQ >= QUESTIONS.length - 1) {
      setFinished(true);
    } else {
      setCurrentQ((p) => p + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const correct = selected === question?.correct;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950/30 to-slate-950 p-4 md:p-8 text-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onExit} className="text-slate-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> Sair da Missão
          </Button>
          <span className="text-emerald-400 font-bold text-sm">
            <Zap className="inline h-4 w-4 mr-1" />
            {litSectors.length}/{QUESTIONS.length} setores iluminados
          </span>
        </div>

        <h2 className="text-3xl font-black text-center mb-6">
          <Zap className="inline mr-2 text-emerald-400" /> Energia Verde
        </h2>

        {/* City visualization */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-8">
          {QUESTIONS.map((_, i) => (
            <motion.div
              key={i}
              className={`h-16 rounded-xl flex items-center justify-center text-2xl transition-all duration-500 ${
                litSectors.includes(i)
                  ? "bg-emerald-500/30 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "bg-slate-800/50 border border-slate-700/30"
              }`}
              animate={litSectors.includes(i) ? { scale: [1, 1.05, 1] } : {}}
            >
              <Lightbulb
                className={`h-6 w-6 transition-all ${
                  litSectors.includes(i) ? "text-emerald-400 fill-emerald-400" : "text-slate-700"
                }`}
              />
            </motion.div>
          ))}
        </div>

        {finished ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
            <h3 className="text-4xl font-black mb-4">⚡ Cidade Iluminada!</h3>
            <p className="text-2xl text-emerald-400 font-bold mb-2">
              {litSectors.length}/{QUESTIONS.length} setores ativados
            </p>
            <p className="text-emerald-400 font-bold mb-2">+{litSectors.length * 20} XP ganhos!</p>
            {litSectors.length === QUESTIONS.length && (
              <p className="text-cyan-400 font-bold mb-4">🏅 Medalha: Especialista em Energia!</p>
            )}
            <div className="flex gap-4 justify-center mt-6">
              <Button onClick={() => { setCurrentQ(0); setSelected(null); setAnswered(false); setLitSectors([]); setFinished(false); }} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
                Jogar Novamente
              </Button>
              <Button variant="outline" onClick={onExit} className="border-slate-600">Voltar ao Menu</Button>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-slate-800/50 rounded-3xl border border-slate-700/50 p-6 md:p-8"
            >
              <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-3">
                Pergunta {currentQ + 1} de {QUESTIONS.length}
              </p>
              <h3 className="text-xl font-bold mb-6">{question.q}</h3>

              <div className="space-y-3">
                {question.opts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    className={`w-full rounded-2xl border-2 p-4 text-left transition-all font-medium ${
                      answered && i === question.correct
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                        : answered && i === selected && !correct
                        ? "border-red-400 bg-red-500/20 text-red-300"
                        : answered
                        ? "border-slate-700 text-slate-500 opacity-50"
                        : "border-slate-700 hover:border-emerald-400 hover:bg-emerald-500/10"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {answered && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
                  <p className={`font-bold mb-4 ${correct ? "text-emerald-400" : "text-red-400"}`}>
                    {correct ? "✅ Correto! Setor iluminado!" : "❌ Resposta incorreta."}
                  </p>
                  <Button onClick={handleNext} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
                    {currentQ >= QUESTIONS.length - 1 ? "Ver Resultado" : "Próxima Pergunta"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
