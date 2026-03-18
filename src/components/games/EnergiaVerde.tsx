import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Wind, Battery, Car } from "lucide-react";
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

// Configuração única para os 8 prédios parecerem um skyline real
const BUILDINGS = [
  { height: "h-32", width: "w-12", cols: 2, rows: 6 },
  { height: "h-48", width: "w-16", cols: 3, rows: 8 },
  { height: "h-24", width: "w-20", cols: 4, rows: 4 },
  { height: "h-56", width: "w-14", cols: 2, rows: 10 },
  { height: "h-40", width: "w-24", cols: 5, rows: 5 },
  { height: "h-64", width: "w-16", cols: 3, rows: 12 },
  { height: "h-36", width: "w-16", cols: 3, rows: 6 },
  { height: "h-52", width: "w-20", cols: 4, rows: 9 },
];

export default function EnergiaVerde({ onExit, onXP }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [litSectors, setLitSectors] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [errorFlicker, setErrorFlicker] = useState(false);

  const question = QUESTIONS[currentQ];
  const energyLevel = litSectors.length / QUESTIONS.length;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    
    if (idx === question.correct) {
      setLitSectors((prev) => [...prev, currentQ]);
      onXP(20);
    } else {
      // Efeito de apagão se errar
      setErrorFlicker(true);
      setTimeout(() => setErrorFlicker(false), 400);
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

  const isCorrect = selected === question?.correct;

  return (
    <div 
      className={`min-h-screen transition-colors duration-1000 relative overflow-hidden flex flex-col ${
        errorFlicker ? "bg-black" : "bg-slate-950"
      }`}
      style={{
        // O céu ganha uma aurora verde conforme a energia sobe
        background: errorFlicker ? "#000" : `radial-gradient(circle at 50% 100%, rgba(16, 185, 129, ${energyLevel * 0.4}) 0%, #020617 100%)`
      }}
    >
      {/* Estrelas no fundo */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto w-full p-4 md:p-8 relative z-10 flex-1 flex flex-col">
        {/* Header HUD */}
        <div className="flex items-center justify-between mb-6 bg-slate-900/40 p-4 rounded-2xl backdrop-blur-md border border-slate-800/50">
          <Button variant="ghost" onClick={onExit} className="text-slate-300 hover:text-white hover:bg-slate-800">
            <ArrowLeft className="mr-2 h-4 w-4" /> Base Central
          </Button>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-300 font-mono text-sm">
              <Battery className="h-5 w-5 text-emerald-400" />
              <span>CARGA: {Math.round(energyLevel * 100)}%</span>
            </div>
            <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
                initial={{ width: 0 }}
                animate={{ width: `${energyLevel * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>

        {/* Skyline da Cidade */}
        <div className="relative h-72 border-b-4 border-slate-800 flex items-end justify-center gap-1 md:gap-4 mb-8 px-4">
          
          {/* Moinhos de Vento ao Fundo */}
          <div className="absolute left-10 bottom-4 opacity-50 flex gap-12 z-0">
            {[1, 2, 3].map((_, i) => (
              <div key={`wind-${i}`} className="flex flex-col items-center">
                <Wind 
                  className="h-12 w-12 text-slate-500" 
                  style={{ 
                    animation: energyLevel > 0 ? `spin ${3 - energyLevel}s linear infinite` : 'none',
                    marginBottom: '-14px'
                  }} 
                />
                <div className="w-1 h-16 bg-slate-700" />
              </div>
            ))}
          </div>

          {/* Prédios (Interativos) */}
          {BUILDINGS.map((b, i) => {
            const isLit = litSectors.includes(i);
            const isActiveQuestion = i === currentQ && !finished;

            return (
              <motion.div
                key={i}
                whileHover={isLit ? { scale: 1.05, y: -5 } : {}}
                className={`relative flex flex-col justify-end p-1 rounded-t-md transition-all duration-700 z-10 cursor-default ${b.height} ${b.width} ${
                  isLit 
                    ? "bg-slate-800 shadow-[0_0_30px_rgba(52,211,153,0.3)] border-t border-x border-emerald-500/50" 
                    : "bg-slate-900 border-t border-x border-slate-800"
                } ${isActiveQuestion ? "ring-2 ring-blue-500/50 ring-offset-2 ring-offset-slate-950" : ""}`}
              >
                {/* Janelas */}
                <div className="grid gap-1 w-full h-full p-1" style={{ gridTemplateColumns: `repeat(${b.cols}, minmax(0, 1fr))` }}>
                  {[...Array(b.cols * b.rows)].map((_, j) => (
                    <motion.div 
                      key={j}
                      initial={false}
                      animate={{
                        backgroundColor: isLit 
                          ? (Math.random() > 0.2 ? "#fef08a" : "#0f172a") // 80% das janelas acesas se isLit
                          : "#020617",
                        boxShadow: isLit ? "0 0 8px rgba(254,240,138,0.5)" : "none"
                      }}
                      className="w-full h-full rounded-[1px] opacity-80"
                    />
                  ))}
                </div>
                
                {/* Antenas/Detalhes no topo */}
                {i % 2 === 0 && (
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-4 ${isLit ? "bg-emerald-400" : "bg-slate-800"}`}>
                    {isLit && <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />}
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Trânsito (Carros passando se houver energia) */}
          {energyLevel > 0.2 && (
            <motion.div 
              className="absolute bottom-1 left-0 right-0 h-4 flex items-center z-20 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                animate={{ x: ["-10%", "110%"] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                <Car className="text-yellow-400 h-4 w-4 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]" />
              </motion.div>
              <motion.div 
                animate={{ x: ["110%", "-10%"] }} 
                transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 2 }}
              >
                <Car className="text-red-400 h-4 w-4 drop-shadow-[0_0_5px_rgba(248,113,113,0.8)] transform scale-x-[-1]" />
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Área de Jogo / Questões */}
        <div className="flex-1 flex flex-col justify-center">
          {finished ? (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-slate-900/60 backdrop-blur-xl border border-emerald-500/30 p-10 rounded-3xl text-center shadow-[0_0_50px_rgba(16,185,129,0.15)]"
            >
              <Zap className="h-20 w-20 text-emerald-400 mx-auto mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
              <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Metrópole Energizada!
              </h2>
              <p className="text-slate-300 text-xl mb-8">
                Você implementou soluções sustentáveis em {litSectors.length} setores da cidade. O futuro agradece!
              </p>
              <Button onClick={() => window.location.reload()} className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 px-8 py-6 text-lg font-bold rounded-xl shadow-lg shadow-emerald-500/20">
                Iniciar Nova Simulação
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.05, opacity: 0 }}
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-2xl mx-auto w-full max-w-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="text-cyan-400 text-xs font-bold tracking-widest uppercase bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-800">
                    Setor {currentQ + 1}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold mb-8 leading-relaxed text-slate-100">{question.q}</h3>

                <div className="grid gap-4">
                  {question.opts.map((opt, i) => {
                    const isThisSelected = selected === i;
                    const isThisCorrect = i === question.correct;
                    
                    let btnStyle = "bg-slate-800/50 border-slate-600 hover:bg-slate-700 hover:border-slate-400 text-slate-200";
                    
                    if (answered) {
                      if (isThisCorrect) {
                        btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                      } else if (isThisSelected) {
                        btnStyle = "bg-red-500/20 border-red-500 text-red-300";
                      } else {
                        btnStyle = "bg-slate-900/50 border-slate-800 text-slate-600 opacity-50";
                      }
                    }

                    return (
                      <button
                        key={i}
                        disabled={answered}
                        onClick={() => handleAnswer(i)}
                        className={`w-full p-4 rounded-xl text-left border-2 transition-all duration-300 font-medium text-lg flex items-center justify-between group ${btnStyle}`}
                      >
                        {opt}
                        {answered && isThisCorrect && <Zap className="h-5 w-5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    className="mt-8 pt-6 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <p className={`font-bold text-lg ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                      {isCorrect ? "✨ Rede conectada com sucesso!" : "⚠️ Falha crítica no gerador."}
                    </p>
                    <Button 
                      onClick={handleNext} 
                      className="w-full sm:w-auto px-8 py-6 text-md font-bold bg-white text-slate-950 hover:bg-slate-200 rounded-xl"
                    >
                      {currentQ === QUESTIONS.length - 1 ? "Analisar Sistema" : "Próximo Setor"}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}