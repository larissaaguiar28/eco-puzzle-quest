"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, 
  ChevronDown, 
  Leaf, 
  Zap, 
  AlertTriangle, 
  Gamepad2, 
  Droplets,
  ArrowRight,
  Sprout,
  Wind,
  Trees
} from "lucide-react";

const faqItems = [
  {
    q: "O que é sustentabilidade ambiental?",
    a: "É a arte de viver em harmonia com os ciclos da Terra. Envolve práticas que garantem que os recursos naturais não se esgotem para as próximas gerações, mantendo o equilíbrio biótico.",
    icon: <Trees className="text-emerald-400" />,
    color: "from-emerald-500/20 to-transparent",
    label: "Equilíbrio"
  },
  {
    q: "Como posso contribuir no dia a dia?",
    a: "Pequenas escolhas como reduzir plásticos de uso único, compostar resíduos orgânicos e economizar água criam um impacto regenerativo gigante em escala global.",
    icon: <Sprout className="text-lime-400" />,
    color: "from-lime-500/20 to-transparent",
    label: "Ação"
  },
  {
    q: "Quais os maiores desafios da nossa era?",
    a: "O aquecimento global e o desmatamento lideram a lista. Estamos em uma corrida para restaurar biomas e proteger a fauna da extinção em massa.",
    icon: <AlertTriangle className="text-amber-400" />,
    color: "from-amber-500/20 to-transparent",
    label: "Alerta"
  },
  {
    q: "O que define uma energia como limpa?",
    a: "Fontes que se renovam naturalmente, como o vento (eólica) e o sol (fotovoltaica). Elas não emitem CO2 e preservam a pureza da nossa atmosfera.",
    icon: <Wind className="text-cyan-400" />,
    color: "from-cyan-500/20 to-transparent",
    label: "Energia"
  },
  {
    q: "Como o progresso no quiz ajuda o planeta?",
    a: "Cada resposta correta simboliza o plantio de conhecimento. Ao completar o desafio, você desbloqueia a visão de um ecossistema totalmente restaurado e vibrante.",
    icon: <Gamepad2 className="text-emerald-300" />,
    color: "from-emerald-300/20 to-transparent",
    label: "Gamificação"
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#040d0a] py-24 relative overflow-hidden min-h-screen flex items-center">
      {/* Background Orgânico - Névoa de Floresta */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-lime-900/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Detalhe de linha vertical sutil que remete a crescimento */}
      <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-emerald-900/30 to-transparent pointer-events-none hidden md:block" />

      <div className="mx-auto max-w-4xl px-6 relative z-10 w-full">
        
        {/* Header com Tom de Sustentabilidade */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6"
          >
            <Leaf className="h-3 w-3" /> Guia de Regeneração
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black text-slate-50 mb-6 tracking-tight"
          >
            Semeando <span className="text-emerald-500">Respostas</span>
          </motion.h2>
          <p className="text-emerald-900/80 max-w-xl mx-auto text-lg font-medium leading-relaxed italic">
            "A natureza não tem pressa, mas tudo nela é realizado." — Entenda como fazer parte dessa mudança.
          </p>
        </div>

        {/* Lista de Acordeões Estilo Bio-Tech */}
        <div className="grid gap-5">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`
                  relative overflow-hidden rounded-[1.5rem] border transition-all duration-700
                  ${isOpen 
                    ? 'bg-emerald-950/30 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.05)]' 
                    : 'bg-white/[0.02] border-white/5 hover:border-emerald-900/50 hover:bg-emerald-950/10'}
                `}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                {/* Overlay de gradiente quando aberto */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} pointer-events-none opacity-30`} 
                    />
                  )}
                </AnimatePresence>

                <div className="relative z-10 p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className={`
                        w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-500
                        ${isOpen ? 'bg-emerald-500 text-slate-950 scale-110 rotate-12' : 'bg-emerald-950/50 text-emerald-500'}
                      `}>
                        {item.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block mb-1">
                          {item.label}
                        </span>
                        <h3 className={`text-lg md:text-xl font-bold transition-colors ${isOpen ? 'text-white' : 'text-slate-300'}`}>
                          {item.q}
                        </h3>
                      </div>
                    </div>
                    
                    <div className={`
                      flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-500
                      ${isOpen ? 'bg-emerald-500 border-emerald-500 text-slate-950 rotate-180' : 'border-emerald-900 text-emerald-900'}
                    `}>
                      <ChevronDown size={18} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="pt-6 pl-[68px]">
                          <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-2xl">
                            {item.a}
                          </p>
                          <motion.button 
                            whileHover={{ x: 8 }}
                            className="flex items-center gap-3 text-emerald-500 font-bold text-xs uppercase tracking-[0.2em]"
                          >
                            Explorar bioma <ArrowRight size={14} className="animate-pulse" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}