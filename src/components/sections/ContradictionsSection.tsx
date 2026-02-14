import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Puzzle, Skull, Bug, AlertTriangle, TrendingDown, Info, ArrowRight } from "lucide-react";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const donutData = [
  { name: "Pecuária", value: 41, color: "#EF4444" }, // Red-500
  { name: "Agricultura", value: 28, color: "#F59E0B" }, // Amber-500
  { name: "Desmatamento", value: 18, color: "#10B981" }, // Emerald-500
  { name: "Outros", value: 13, color: "#3B82F6" }, // Blue-500
];

export function ContradictionsSection() {
  const [showQuiz, setShowQuiz] = useState(false);
  const { isCompleted } = useQuiz();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section id="contradictions" className="relative py-24 bg-[#F1F3EC] overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-[120px] -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full blur-[120px] -z-10 opacity-50" />

      <div className="mx-auto max-w-6xl px-6 w-full relative">
        {/* Header Centralizado e Robusto */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase tracking-widest mb-6"
          >
            <AlertTriangle className="h-3 w-3" /> Verdades Ocultas
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
          >
            Problemas que <span className="text-red-600 underline decoration-red-200 underline-offset-8">Ninguém Fala</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg font-medium"
          >
            Abaixo da superfície do progresso, existem impactos que moldam o futuro do nosso ecossistema e saúde.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* Lado Esquerdo: Cards de Texto Interativos */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              whileHover={{ x: 10 }}
              className="group relative bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 transition-all"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-red-50 rounded-2xl text-red-600 group-hover:rotate-12 transition-transform">
                  <Skull className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">Agrotóxicos</h3>
                  <p className="text-xs font-bold text-red-400 uppercase tracking-tighter">Brasil: Recordista Mundial</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                O Brasil consome mais de <span className="text-red-600 font-black px-1">500 mil toneladas</span> anuais de venenos proibidos globalmente, contaminando nossa cadeia alimentar.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {["30% dos alimentos acima do limite", "Contaminação sistêmica de lençóis"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-500 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <TrendingDown className="h-4 w-4 text-red-400" /> {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ x: 10 }}
              className="group relative bg-[#0D3B2E] rounded-[2.5rem] p-8 shadow-2xl border border-[#164D3D] text-white overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10"><Bug className="h-16 w-16" /></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400">
                  <Bug className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black">Pecuária Predatória</h3>
              </div>
              <p className="text-emerald-100/80 leading-relaxed font-medium">
                A pecuária extensiva é o motor por trás de <span className="text-emerald-400 font-black underline underline-offset-4">80% do desmatamento</span> na Amazônia, gerando mais emissões que o setor de transporte global.
              </p>
            </motion.div>
          </div>

          {/* Lado Direito: Gráfico Moderno */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="lg:col-span-7 bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col items-center justify-center min-h-[500px]"
          >
            <div className="flex items-center gap-2 mb-8 bg-slate-100 px-6 py-2 rounded-full">
              <Info className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest">Ocupação de Solo (%)</h3>
            </div>
            
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={140}
                    paddingAngle={8}
                    dataKey="value"
                    onMouseEnter={(_, index) => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {donutData.map((entry, index) => (
                      <Cell 
                        key={index} 
                        fill={entry.color} 
                        stroke="none"
                        style={{
                          filter: hoveredIndex === index ? `drop-shadow(0 0 12px ${entry.color}80)` : 'none',
                          cursor: 'pointer',
                          opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.6,
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {donutData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Botão de Quiz - Estilo Premium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 flex justify-center"
        >
          <Button
            onClick={() => setShowQuiz(true)}
            className={`group relative h-16 px-12 rounded-2xl text-lg font-black transition-all duration-500 overflow-hidden shadow-2xl
              ${isCompleted(5) 
                ? "bg-amber-400 text-slate-900 hover:bg-amber-500" 
                : "bg-slate-950 text-white hover:bg-red-600 hover:shadow-red-500/30"
              }`}
          >
            <span className="relative z-10 flex items-center gap-4">
              {isCompleted(5) ? "Conhecimento Provado ✓" : "Enfrentar o Desafio"}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showQuiz && <QuizModal sectionIndex={5} onClose={() => setShowQuiz(false)} />}
      </AnimatePresence>
    </section>
  );
}