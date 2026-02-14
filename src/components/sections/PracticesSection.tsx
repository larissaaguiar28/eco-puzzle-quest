import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sprout, Recycle, Zap, Leaf, Puzzle, ChevronLeft, ChevronRight, 
  TreePine, Bike, ShoppingBag, Lightbulb, Sparkles, CheckCircle2 
} from "lucide-react";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";

const practices = [
  { 
    icon: Sprout, title: "Replantio", desc: "Participe de programas de reflorestamento e restaure ecossistemas.", 
    color: "text-emerald-900", 
    cardBg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    iconBg: "bg-emerald-500",
    accent: "border-emerald-200",
    shadow: "hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.35)]"
  },
  { 
    icon: Zap, title: "Consumo Eficiente", desc: "Reduza o consumo de energia com lâmpadas LED e aparelhos modernos.", 
    color: "text-amber-900", 
    cardBg: "bg-gradient-to-br from-amber-50 to-orange-100",
    iconBg: "bg-amber-500",
    accent: "border-amber-200",
    shadow: "hover:shadow-[0_25px_50px_-12px_rgba(245,158,11,0.35)]"
  },
  { 
    icon: Recycle, title: "Reciclagem", desc: "Separe o lixo corretamente e dê nova vida aos materiais descartados.", 
    color: "text-blue-900", 
    cardBg: "bg-gradient-to-br from-blue-50 to-cyan-100",
    iconBg: "bg-blue-500",
    accent: "border-blue-200",
    shadow: "hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.35)]"
  },
  { 
    icon: Leaf, title: "Consumo Consciente", desc: "Prefira produtos orgânicos e de origem sustentável no seu dia a dia.", 
    color: "text-green-900", 
    cardBg: "bg-gradient-to-br from-green-50 to-emerald-100",
    iconBg: "bg-green-500",
    accent: "border-green-200",
    shadow: "hover:shadow-[0_25px_50px_-12px_rgba(34,197,94,0.35)]"
  },
  { 
    icon: TreePine, title: "Preservação", desc: "Apoie iniciativas de conservação e combate ao desmatamento.", 
    color: "text-teal-900", 
    cardBg: "bg-gradient-to-br from-teal-50 to-emerald-100",
    iconBg: "bg-teal-500",
    accent: "border-teal-200",
    shadow: "hover:shadow-[0_25px_50px_-12px_rgba(20,184,166,0.35)]"
  },
  { 
    icon: Bike, title: "Mobilidade Verde", desc: "Use bicicleta ou transporte público para reduzir emissões de CO₂.", 
    color: "text-indigo-900", 
    cardBg: "bg-gradient-to-br from-indigo-50 to-blue-100",
    iconBg: "bg-indigo-500",
    accent: "border-indigo-200",
    shadow: "hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.35)]"
  },
  { 
    icon: ShoppingBag, title: "Compras", desc: "Leve sacolas próprias e prefira fortalecer o comércio local.", 
    color: "text-rose-900", 
    cardBg: "bg-gradient-to-br from-rose-50 to-orange-100",
    iconBg: "bg-rose-500",
    accent: "border-rose-200",
    shadow: "hover:shadow-[0_25px_50px_-12px_rgba(244,63,94,0.35)]"
  },
  { 
    icon: Lightbulb, title: "Educação", desc: "Compartilhe conhecimento sobre sustentabilidade com a comunidade.", 
    color: "text-yellow-900", 
    cardBg: "bg-gradient-to-br from-yellow-50 to-amber-100",
    iconBg: "bg-yellow-500",
    accent: "border-yellow-200",
    shadow: "hover:shadow-[0_25px_50px_-12px_rgba(234,179,8,0.35)]"
  },
];

const CARDS_PER_PAGE = 4;

export function PracticesSection() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [page, setPage] = useState(0);
  const { isCompleted } = useQuiz();
  const completed = isCompleted(3);

  const totalPages = Math.ceil(practices.length / CARDS_PER_PAGE);
  const currentCards = practices.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);

  const nextPage = () => setPage((p) => Math.min(totalPages - 1, p + 1));
  const prevPage = () => setPage((p) => Math.max(0, p - 1));

  return (
    <section id="practices" className="py-32 bg-[#FBFCFA] overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-40 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/50 text-emerald-700 text-[11px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Sparkles size={14} /> Agir Agora
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-zinc-900 mb-8 tracking-tighter"
          >
            Pequenas Ações,<br />
            <span className="text-emerald-600 italic">Grandes Impactos.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-zinc-500 max-w-2xl mx-auto text-xl font-medium leading-relaxed"
          >
            Escolha um hábito sustentável hoje e ajude a regenerar o ecossistema do nosso planeta.
          </motion.p>
        </div>

        {/* Bento Grid Carousel */}
        <div className="relative group/carousel">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {currentCards.map((p, i) => (
                <motion.div
                  key={p.title}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className={`
                    relative overflow-hidden p-10 rounded-[3rem] border-2 
                    ${p.accent} ${p.cardBg} 
                    shadow-[0_15px_30px_-15px_rgba(0,0,0,0.05)]
                    ${p.shadow}
                    transition-all duration-500 cursor-default group
                  `}
                >
                  {/* Icon Container */}
                  <div className={`
                    w-16 h-16 ${p.iconBg} rounded-[1.25rem] flex items-center justify-center mb-8
                    shadow-[0_15px_25px_-5px_rgba(0,0,0,0.1)] group-hover:shadow-2xl transition-all duration-500
                    group-hover:rotate-6
                  `}>
                    <p.icon size={32} className="text-white" strokeWidth={2.5} />
                  </div>

                  <h4 className={`font-black ${p.color} text-2xl mb-4 tracking-tight`}>
                    {p.title}
                  </h4>
                  <p className={`${p.color} opacity-80 text-sm font-bold leading-relaxed`}>
                    {p.desc}
                  </p>

                  {/* Decorative Large Background Icon */}
                  <div className={`absolute -bottom-8 -right-8 opacity-[0.03] ${p.color} -rotate-12 group-hover:rotate-0 transition-transform duration-700`}>
                    <p.icon size={180} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-10 mt-16">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              disabled={page === 0}
              className="w-14 h-14 rounded-full border-zinc-200 bg-white text-zinc-900 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 disabled:opacity-20 transition-all shadow-xl"
            >
              <ChevronLeft size={28} />
            </Button>

            <div className="flex gap-3">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    i === page ? "w-12 bg-emerald-600" : "w-2.5 bg-zinc-200 hover:bg-zinc-300"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={page === totalPages - 1}
              className="w-14 h-14 rounded-full border-zinc-200 bg-white text-zinc-900 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 disabled:opacity-20 transition-all shadow-xl"
            >
              <ChevronRight size={28} />
            </Button>
          </div>
        </div>

        {/* Premium CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-28 text-center"
        >
          <Button
            onClick={() => setShowQuiz(true)}
            className={`
              relative h-20 px-14 rounded-3xl text-xl font-black uppercase tracking-[0.1em] overflow-hidden transition-all duration-700 group
              ${completed 
                ? "bg-amber-400 text-zinc-900 shadow-[0_20px_60px_-15px_rgba(251,191,36,0.5)] hover:bg-amber-300" 
                : "bg-emerald-600 text-white shadow-[0_20px_60px_-15px_rgba(5,150,105,0.4)] hover:bg-emerald-500 hover:scale-105"}
            `}
          >
            {/* Shimmer Effect */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
            
            <div className="relative z-10 flex items-center gap-4">
              {completed ? (
                <>
                  <CheckCircle2 size={28} className="animate-bounce" />
                  <span>Conquista Adquirida</span>
                </>
              ) : (
                <>
                  <Puzzle size={28} className="group-hover:rotate-12 transition-transform" />
                  <span>Testar Conhecimentos</span>
                </>
              )}
            </div>
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showQuiz && <QuizModal sectionIndex={3} onClose={() => setShowQuiz(false)} />}
      </AnimatePresence>
    </section>
  );
}