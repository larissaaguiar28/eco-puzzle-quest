import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Bug, AlertTriangle, TrendingDown, Info, ArrowRight, TreePine, Pickaxe, CheckCircle2 } from "lucide-react";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Dados unificados
const impactData = [
  {
    id: 0,
    name: "Pecuária",
    value: 41,
    color: "#EF4444", // Red-500
    icon: Bug,
    title: "Pecuária Predatória",
    subtitle: "O Maior Impacto",
    description: "A pecuária extensiva é o motor por trás de 80% do desmatamento na Amazônia, gerando mais emissões que o setor de transporte global.",
    stats: ["Maior vetor de desmatamento", "Emissões altíssimas de metano"],
  },
  {
    id: 1,
    name: "Agricultura",
    value: 28,
    color: "#F59E0B", // Amber-500
    icon: Skull,
    title: "Agrotóxicos na Lavoura",
    subtitle: "Brasil: Recordista Mundial",
    description: "O Brasil consome mais de 500 mil toneladas anuais de venenos proibidos globalmente, contaminando nossa cadeia alimentar.",
    stats: ["30% dos alimentos acima do limite", "Contaminação de lençóis freáticos"],
  },
  {
    id: 2,
    name: "Desmatamento",
    value: 18,
    color: "#10B981", // Emerald-500
    icon: TreePine,
    title: "Perda de Biodiversidade",
    subtitle: "Ameaça Iminente",
    description: "A supressão vegetal desenfreada destrói habitats únicos, levando milhares de espécies à extinção e alterando o ciclo de chuvas.",
    stats: ["Perda de espécies endêmicas", "Aumento de secas extremas"],
  },
  {
    id: 3,
    name: "Outros",
    value: 13,
    color: "#3B82F6", // Blue-500
    icon: Pickaxe,
    title: "Garimpo e Extrativismo",
    subtitle: "Impactos Silenciosos",
    description: "Atividades industriais e extrativismo ilegal continuam a poluir rios com metais pesados e degradar áreas de proteção.",
    stats: ["Poluição de rios com mercúrio", "Invasão de terras protegidas"],
  }
];

export function ContradictionsSection() {
  const [showQuiz, setShowQuiz] = useState(false);
  const { isCompleted } = useQuiz();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Rastreador de áreas exploradas pelo usuário
  const [viewedItems, setViewedItems] = useState([0]);

  const activeContent = impactData[selectedIndex];
  const allExplored = viewedItems.length === impactData.length;

  const handleSelect = (index) => {
    setSelectedIndex(index);
    if (!viewedItems.includes(index)) {
      setViewedItems(prev => [...prev, index]);
    }
  };

  return (
    <section id="contradictions" className="relative py-24 bg-[#F1F3EC] overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-[120px] -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full blur-[120px] -z-10 opacity-50" />

      <div className="mx-auto max-w-6xl px-6 w-full relative">
        {/* Header */}
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
            Abaixo da superfície do progresso, existem impactos que moldam o futuro do nosso ecossistema e saúde. Clique no gráfico para explorar.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
          
          {/* Lado Esquerdo: Card Dinâmico com Tema Escuro Adaptável */}
          <div className="lg:col-span-5 relative min-h-[440px] flex flex-col justify-center">
            {/* Indicador de Descoberta */}
            <div className="absolute -top-6 left-0 flex items-center gap-2 text-sm font-bold text-slate-500 mb-2">
              <div className="flex gap-1">
                {impactData.map((_, i) => (
                  <div key={i} className={`h-1.5 w-6 rounded-full transition-colors duration-500 ${viewedItems.includes(i) ? 'bg-slate-800' : 'bg-slate-300'}`} />
                ))}
              </div>
              <span>{viewedItems.length}/{impactData.length} Explorados</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-[2rem] p-8 transition-all overflow-hidden"
                style={{
                  backgroundColor: '#0F172A', // Slate 900 base escuro
                  border: `1px solid ${activeContent.color}40`,
                  boxShadow: `0 20px 40px -15px ${activeContent.color}60`
                }}
              >
                {/* Ícone de fundo com a cor correspondente */}
                <div 
                  className="absolute top-0 right-0 p-4 opacity-[0.05]"
                  style={{ color: activeContent.color }}
                >
                  <activeContent.icon className="h-32 w-32 -mt-8 -mr-8" />
                </div>

                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div 
                    className="p-4 rounded-2xl"
                    style={{ backgroundColor: `${activeContent.color}20`, color: activeContent.color }}
                  >
                    <activeContent.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">
                      {activeContent.title}
                    </h3>
                    <p 
                      className="text-xs font-bold uppercase tracking-tighter"
                      style={{ color: activeContent.color }}
                    >
                      {activeContent.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed mb-6 font-medium relative z-10">
                  {activeContent.description}
                </p>

                <div className="grid grid-cols-1 gap-3 relative z-10">
                  {activeContent.stats.map((item, i) => (
                    <div 
                      key={i} 
                      className="flex items-center gap-2 text-sm font-semibold p-3 rounded-xl border bg-slate-800/50 text-slate-200"
                      style={{ borderColor: `${activeContent.color}30` }}
                    >
                      <TrendingDown className="h-4 w-4" style={{ color: activeContent.color }} /> 
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Hint visual interativo corrigido */}
            {!allExplored && (
              <div className="absolute -bottom-10 left-0 right-0 text-center animate-pulse">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  👆 Clique em outra área do gráfico
                </span>
              </div>
            )}
            {allExplored && (
              <div className="absolute -bottom-10 left-0 right-0 text-center">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Panorama Completo
                </span>
              </div>
            )}
          </div>

          {/* Lado Direito: Gráfico Interativo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="lg:col-span-7 bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col items-center justify-center min-h-[500px]"
          >
            <div className="flex items-center gap-2 mb-8 bg-slate-100 px-6 py-2 rounded-full">
              <Info className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest">Ocupação de Solo (%)</h3>
            </div>
            
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impactData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={140}
                    paddingAngle={8}
                    dataKey="value"
                    onMouseEnter={(_, index) => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={(_, index) => handleSelect(index)}
                  >
                    {impactData.map((entry, index) => {
                      const isSelected = selectedIndex === index;
                      const isHovered = hoveredIndex === index;
                      const isDimmed = hoveredIndex !== null && !isHovered;

                      return (
                        <Cell 
                          key={index} 
                          fill={entry.color} 
                          stroke={isSelected ? "#0F172A" : "none"} // Borda escura quando selecionado combinando com o card
                          strokeWidth={isSelected ? 6 : 0}
                          style={{
                            filter: (isHovered || isSelected) ? `drop-shadow(0 0 12px ${entry.color}80)` : 'none',
                            cursor: 'pointer',
                            opacity: isDimmed ? 0.3 : (isSelected ? 1 : 0.8),
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            transformOrigin: 'center'
                          }}
                        />
                      )
                    })}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                    itemStyle={{ color: '#334155' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legenda Clicável */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {impactData.map((item, index) => {
                const isSelected = selectedIndex === index;
                const isViewed = viewedItems.includes(index);
                
                return (
                  <button 
                    key={index} 
                    onClick={() => handleSelect(index)}
                    className={`flex items-center gap-2 transition-all px-4 py-2 rounded-full border
                      ${isSelected ? 'bg-slate-900 border-slate-900 scale-105' : 'bg-transparent border-slate-200 hover:bg-slate-50 opacity-70 hover:opacity-100'}
                    `}
                  >
                    <div className="w-3 h-3 rounded-full relative" style={{ backgroundColor: item.color }}>
                       {/* Ponto verde sutil se já foi visualizado mas não está selecionado */}
                       {isViewed && !isSelected && (
                         <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white" />
                       )}
                    </div>
                    <span className={`text-xs font-black uppercase tracking-tighter ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                      {item.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Botão de Quiz com estado especial caso tudo tenha sido explorado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 flex justify-center relative"
        >
          {allExplored && !isCompleted(5) && (
            <div className="absolute -top-8 text-xs font-bold text-amber-600 animate-bounce">
              Você descobriu tudo! Pronto para o desafio?
            </div>
          )}
          <Button
            onClick={() => setShowQuiz(true)}
            className={`group relative h-16 px-12 rounded-2xl text-lg font-black transition-all duration-500 overflow-hidden shadow-2xl
              ${isCompleted(5) 
                ? "bg-amber-400 text-slate-900 hover:bg-amber-500" 
                : allExplored 
                  ? "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/50 scale-105"
                  : "bg-slate-950 text-white hover:bg-red-600 hover:shadow-red-500/30"
              }`}
          >
            <span className="relative z-10 flex items-center gap-4">
              {isCompleted(5) ? "Conhecimento Provado ✓" : "Enfrentar o Desafio"}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showQuiz && <QuizModal sectionIndex={5} onClose={() => setShowQuiz(false)} />}
      </AnimatePresence>
    </section>
  );
}