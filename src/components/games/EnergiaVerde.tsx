import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Adicionado 'Star' ao import abaixo
import { ArrowLeft, Zap, Wind, Battery, Car, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onExit: () => void;
  onXP: (amount: number) => void;
}

const ALL_QUESTIONS = [
  { q: "Qual fonte de energia utiliza a luz do sol para gerar eletricidade?", opts: ["Eólica", "Solar", "Nuclear", "Hidrelétrica"], correct: 1 },
  { q: "Turbinas eólicas convertem a energia do ______ em eletricidade.", opts: ["Calor", "Vento", "Água", "Carvão"], correct: 1 },
  { q: "Qual é considerada a fonte de energia mais limpa?", opts: ["Gás natural", "Petróleo", "Solar", "Carvão"], correct: 2 },
  { q: "O que significa a sigla 'kWh'?", opts: ["Quilowatt-hora", "Quilômetro-hora", "Quilovolt-hora", "Quiloampère-hora"], correct: 0 },
  { q: "Usinas hidrelétricas aproveitam a força da:", opts: ["Maré", "Água corrente", "Lava vulcânica", "Gravidade lunar"], correct: 1 },
  { q: "Biomassa é uma fonte de energia derivada de:", opts: ["Minerais", "Matéria orgânica", "Combustíveis fósseis", "Energia nuclear"], correct: 1 },
  { q: "Qual país lidera a produção mundial de energia eólica?", opts: ["Brasil", "Alemanha", "China", "EUA"], correct: 2 },
  { q: "O que é 'net zero' em termos de energia?", opts: ["Zero consumo", "Emissões líquidas zero", "Zero investimento", "Zero importação"], correct: 1 },
  { q: "Qual destes é um combustível fóssil?", opts: ["Biodiesel", "Gás Natural", "Etanol", "Hidrogênio"], correct: 1 },
  { q: "A energia geotérmica é obtida através do calor de onde?", opts: ["Do Sol", "Dos Oceanos", "Do interior da Terra", "Da queima de lixo"], correct: 2 },
  { q: "O que o inversor solar faz num sistema fotovoltaico?", opts: ["Armazena energia", "Converte CC para CA", "Limpa os painéis", "Gira as placas"], correct: 1 },
  { q: "Qual o principal componente das células solares?", opts: ["Ferro", "Cobre", "Silício", "Prata"], correct: 2 },
  { q: "A energia das marés também é conhecida como:", opts: ["Energia Maremotriz", "Energia Térmica", "Energia Cinética", "Energia Eólica"], correct: 0 },
  { q: "O que é o efeito estufa?", opts: ["Resfriamento global", "Aquecimento da atmosfera", "Um tipo de energia", "Limpeza do ar"], correct: 1 },
  { q: "Qual destes transportes é mais sustentável?", opts: ["Carro a diesel", "Avião", "Bicicleta", "Navio cargueiro"], correct: 2 },
  { q: "Qual gás é o principal responsável pelo efeito estufa?", opts: ["Oxigênio", "Nitrogênio", "Dióxido de Carbono", "Hélio"], correct: 2 },
  { q: "O que é hidrogênio verde?", opts: ["Hidrogênio colorido", "Produzido com energia renovável", "Extraído de plantas", "Gás tóxico"], correct: 1 },
  { q: "Qual a principal vantagem dos carros elétricos?", opts: ["Mais lentos", "Zero emissão local", "Não precisam de carga", "Usam gasolina"], correct: 1 },
  { q: "O que são fontes renováveis?", opts: ["Esgotam rápido", "Se regeneram na natureza", "São artificiais", "Causam muita poluição"], correct: 1 },
  { q: "Qual fonte usa o calor do sol para aquecer água diretamente?", opts: ["Fotovoltaica", "Térmica Solar", "Nuclear", "Biomassa"], correct: 1 },
  { q: "A queima de carvão mineral libera muito:", opts: ["Vapor de água", "Oxigênio", "CO2", "Argônio"], correct: 2 },
  { q: "Onde se localizam as usinas 'offshore'?", opts: ["No deserto", "No mar", "Nas montanhas", "Subterrâneas"], correct: 1 },
  { q: "Qual a função de uma bateria em sistemas renováveis?", opts: ["Criar energia", "Destruir resíduos", "Armazenar energia", "Aumentar o vento"], correct: 2 },
  { q: "O 'lixo eletrônico' deve ser descartado em:", opts: ["Lixo comum", "Pontos específicos", "Rios", "Canteiros"], correct: 1 },
  { q: "A energia nuclear é considerada de qual tipo?", opts: ["Renovável", "Baixa emissão de carbono", "Orgânica", "Infinita"], correct: 1 },
  { q: "Qual o benefício da iluminação LED?", opts: ["Gasta mais energia", "Menor consumo e maior vida útil", "Esquenta muito", "É feita de vidro"], correct: 1 },
  { q: "O que é eficiência energética?", opts: ["Usar mais energia", "Gastar energia à toa", "Fazer o mesmo com menos energia", "Desligar tudo"], correct: 2 },
  { q: "Qual destes materiais é reciclável?", opts: ["Papel sujo", "Alumínio", "Espelho", "Cerâmica"], correct: 1 },
  { q: "O biogás é produzido a partir de:", opts: ["Pedras", "Decomposição de matéria orgânica", "Vento forte", "Congelamento"], correct: 1 },
  { q: "Qual o maior impacto ambiental de grandes hidrelétricas?", opts: ["Fumaça", "Alagamento de grandes áreas", "Barulho excessivo", "Radiação"], correct: 1 },
  { q: "Painéis solares funcionam em dias nublados?", opts: ["Não, param totalmente", "Sim, mas com menor eficiência", "Funcionam melhor", "Explodem"], correct: 1 },
  { q: "O que é o Acordo de Paris?", opts: ["Um tratado de paz", "Tratado sobre mudanças climáticas", "Uma festa na França", "Acordo comercial"], correct: 1 },
  { q: "Qual cor de lixeira representa o papel?", opts: ["Verde", "Azul", "Vermelho", "Amarelo"], correct: 1 },
  { q: "Qual cor de lixeira representa o plástico?", opts: ["Verde", "Azul", "Vermelho", "Amarelo"], correct: 2 },
  { q: "O que é 'smart grid'?", opts: ["Rede elétrica inteligente", "Uma grade de metal", "Rede de pesca", "Um novo celular"], correct: 0 },
  { q: "A energia cinética vem de onde?", opts: ["Do calor", "Do movimento", "Do repouso", "Dos átomos"], correct: 1 },
  { q: "Qual o principal combustível do Sol?", opts: ["Oxigênio", "Hidrogênio", "Hélio", "Carbono"], correct: 1 },
  { q: "A reciclagem de latinhas economiza quanta energia?", opts: ["10%", "50%", "95%", "0%"], correct: 2 },
];

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
  const selectedQuestions = useMemo(() => {
    return [...ALL_QUESTIONS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
  }, []);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [litSectors, setLitSectors] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [errorFlicker, setErrorFlicker] = useState(false);
  const [score, setScore] = useState(0);

  const question = selectedQuestions[currentQ];
  const energyLevel = litSectors.length / selectedQuestions.length;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    
    if (idx === question.correct) {
      setLitSectors((prev) => [...prev, currentQ]);
      setScore(prev => prev + 1);
      onXP(20);
    } else {
      setErrorFlicker(true);
      setTimeout(() => setErrorFlicker(false), 400);
    }
  };

  const handleNext = () => {
    if (currentQ >= selectedQuestions.length - 1) {
      setFinished(true);
    } else {
      setCurrentQ((p) => p + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-1000 relative overflow-hidden flex flex-col ${
        errorFlicker ? "bg-black" : "bg-[#020617]"
      }`}
      style={{
        background: errorFlicker 
          ? "#000" 
          : `radial-gradient(circle at 50% 120%, rgba(16, 185, 129, ${energyLevel * 0.2}) 0%, #020617 100%)`
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(70)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: Math.random() }}
            animate={{ opacity: [0.1, 0.7, 0.1] }}
            transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 5 }}
            className="absolute bg-white rounded-full"
            style={{
              top: `${Math.random() * 70}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
            }}
          />
        ))}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto w-full p-4 md:p-8 relative z-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6 bg-slate-900/40 p-4 rounded-2xl backdrop-blur-md border border-white/5 shadow-inner">
          <Button variant="ghost" onClick={onExit} className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Base Central
          </Button>
          <div className="flex items-center gap-6 bg-slate-950/50 p-2 px-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2.5 text-emerald-400 font-mono text-sm font-bold tracking-tight">
              <Zap className="h-4 w-4 animate-pulse text-emerald-300" />
              <span>SISTEMA: {Math.round(energyLevel * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="relative h-72 border-b-2 border-slate-800/60 flex items-end justify-center gap-1.5 md:gap-4 mb-8">
          {BUILDINGS.map((b, i) => {
            const isLit = litSectors.includes(i);
            return (
              <div 
                key={i} 
                className={`relative ${b.height} ${b.width} transition-all duration-1000 rounded-t-lg ${
                  isLit 
                    ? "bg-slate-800 shadow-[0_-15px_50px_rgba(52,211,153,0.12)] border-t border-x border-emerald-500/30" 
                    : "bg-slate-900/90 border-t border-x border-slate-800"
                }`}
              >
                <div className="grid gap-1.5 p-2 h-full" style={{ gridTemplateColumns: `repeat(${b.cols}, 1fr)` }}>
                  {[...Array(b.cols * b.rows)].map((_, j) => (
                    <div key={j} className={`rounded transition-all duration-700 ${isLit ? "bg-yellow-100 shadow-[0_0_10px_rgba(254,240,138,0.5)]" : "bg-slate-950/60"}`} />
                  ))}
                </div>
              </div>
            );
          })}
          <div className="absolute -bottom-px left-0 right-0 h-10 bg-gradient-to-t from-[#020617] to-transparent opacity-60 pointer-events-none" />
        </div>

        <div className="flex-1 flex flex-col justify-center relative z-20">
          {finished ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900/90 border border-emerald-500/30 p-12 rounded-3xl text-center backdrop-blur-xl shadow-[0_0_60px_rgba(16,185,129,0.1)]">
              <Trophy className="h-24 w-24 text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]" />
              <h1 className="text-5xl font-black mb-3 text-white tracking-tighter">Missão Concluída!</h1>
              <p className="text-emerald-300 text-7xl font-black mb-8 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]">{score} <span className="text-3xl text-slate-400 font-medium">/ 8 Acertos</span></p>
              <Button onClick={() => window.location.reload()} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-12 py-7 text-xl rounded-2xl shadow-lg transition-transform hover:scale-105">
                Reiniciar Simulação
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={currentQ} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="bg-slate-900/70 p-10 rounded-3xl border border-slate-700/50 max-w-2xl mx-auto w-full backdrop-blur-sm shadow-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl overflow-hidden bg-slate-800">
                    <motion.div className="h-full bg-emerald-500" initial={{ width: "0%" }} animate={{ width: `${((currentQ + 1) / 8) * 100}%` }} />
                </div>
                <div className="flex justify-between items-center mb-6 pt-2">
                   <p className="text-cyan-400 font-mono text-xs font-bold tracking-widest uppercase bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-800/50">SETOR {currentQ + 1} DE 8</p>
                   <p className="text-slate-400 text-sm font-medium">Acertos: <span className="text-emerald-400 font-bold">{score}</span></p>
                </div>
                <h3 className="text-3xl font-extrabold mb-10 text-white leading-tight tracking-tight">{question.q}</h3>
                <div className="grid gap-4">
                  {question.opts.map((opt, i) => {
                    const isCorrectBtn = i === question.correct;
                    const isSelectedBtn = selected === i;
                    return (
                      <button
                        key={i}
                        disabled={answered}
                        onClick={() => handleAnswer(i)}
                        className={`p-5 rounded-xl text-left border-2 transition-all duration-300 text-lg font-semibold flex items-center justify-between group ${
                          answered 
                            ? isCorrectBtn ? "bg-emerald-600/30 border-emerald-500 text-emerald-200" : isSelectedBtn ? "bg-red-600/30 border-red-500 text-red-200" : "bg-slate-900/40 border-slate-800 text-slate-600 opacity-60"
                            : "bg-slate-800/60 border-slate-700 hover:border-emerald-700 hover:bg-slate-800 text-slate-100"
                        }`}
                      >
                        {opt}
                        {answered && isCorrectBtn && <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mt-10 pt-8 border-t border-slate-800 flex justify-end">
                    <Button onClick={handleNext} className="py-7 px-10 bg-white text-slate-950 font-extrabold text-xl hover:bg-emerald-50 rounded-2xl shadow-xl transition-all group hover:scale-105">
                      {currentQ === 7 ? "Ver Diagnóstico Final" : "Avançar para Próximo Setor"}
                      <Zap className="ml-2.5 h-5 w-5 text-emerald-600 group-hover:animate-bounce" />
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