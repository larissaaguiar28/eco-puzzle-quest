import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Puzzle, Leaf, Globe, Wind, Droplets, Sun, Sparkles } from "lucide-react";
import { QuizModal } from "@/components/QuizModal";
import { useQuiz } from "@/contexts/QuizContext";
import { Button } from "@/components/ui/button";

const timelineEvents = [
  { year: "1970", title: "Impacto Industrial", desc: "Emissões de CO₂ industriais triplicam, despertando a consciência global.", icon: <Wind className="w-5 h-5" />, color: "text-emerald-400" },
  { year: "1988", title: "Voz da Ciência", desc: "Criação do IPCC: a ciência assume o protagonismo na luta climática.", icon: <Globe className="w-5 h-5" />, color: "text-blue-400" },
  { year: "1992", title: "Eco-Consciência", desc: "Rio 92: O maior encontro de nações pela sustentabilidade na história.", icon: <Leaf className="w-5 h-5" />, color: "text-green-500" },
  { year: "2004", title: "Alerta na Amazônia", desc: "Pico crítico de desmatamento força novas políticas de proteção ambiental.", icon: <Droplets className="w-5 h-5" />, color: "text-cyan-400" },
  { year: "2015", title: "O Pacto Global", desc: "Acordo de Paris: A humanidade define um limite para o aquecimento.", icon: <Sun className="w-5 h-5" />, color: "text-orange-400" },
  { year: "2023", title: "Limite Extremo", desc: "O ano mais quente registrado reforça a urgência da transição energética.", icon: <Sparkles className="w-5 h-5" />, color: "text-red-400" },
];

export function TimelineSection() {
  const [showQuiz, setShowQuiz] = useState(false);
  const { isCompleted } = useQuiz();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section id="timeline" className="relative min-h-screen bg-[#061512] py-24 overflow-hidden text-slate-200">
      {/* Background Orgânico */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-green-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-b from-emerald-100 to-emerald-500 bg-clip-text text-transparent">
            Eco-Timeline
          </h2>
          <p className="text-emerald-200/60 max-w-2xl mx-auto text-lg italic">
            "A natureza não tem pressa, mas tudo nela se realiza."
          </p>
        </motion.div>

        <div className="relative">
          {/* Tronco Central "Vivo" */}
          <div className="absolute left-1/2 top-0 h-full w-[4px] -translate-x-1/2 bg-emerald-950/50 rounded-full hidden md:block">
            <motion.div 
              style={{ scaleY, originY: 0 }}
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-400 to-gold shadow-[0_0_20px_rgba(16,185,129,0.5)]"
            />
          </div>

          <div className="space-y-24">
            {timelineEvents.map((event, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={event.year}
                  initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Card Futurista */}
                  <div className={`w-full md:w-[45%] ${isLeft ? "md:text-right" : "md:text-left"}`}>
                    <div className="group relative p-8 rounded-[2rem] bg-emerald-950/20 border border-emerald-500/20 backdrop-blur-xl hover:border-emerald-400/50 transition-all duration-500 shadow-2xl overflow-hidden">
                      {/* Efeito de brilho interno no hover */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className={`flex items-center gap-4 mb-4 ${isLeft ? "md:flex-row-reverse" : "flex-row"}`}>
                        <div className={`p-3 rounded-2xl bg-[#0a201c] border border-emerald-500/30 ${event.color} group-hover:scale-110 transition-transform`}>
                          {event.icon}
                        </div>
                        <span className="text-3xl font-black text-gold/80 tracking-widest">{event.year}</span>
                      </div>

                      <h4 className="text-xl font-bold text-emerald-50 text-balance mb-2 group-hover:text-emerald-300">
                        {event.title}
                      </h4>
                      <p className="text-emerald-100/50 text-sm leading-relaxed">
                        {event.desc}
                      </p>
                    </div>
                  </div>

                  {/* Nodo Central (Flor/Semente) */}
                  <div className="relative z-10 flex items-center justify-center w-12 h-12">
                    <motion.div 
                      whileHover={{ scale: 1.5 }}
                      className="w-4 h-4 rounded-full bg-gold border-4 border-emerald-900 shadow-[0_0_15px_#D4AF37]" 
                    />
                    <div className="absolute w-8 h-8 border border-emerald-500/30 rounded-full animate-ping opacity-20" />
                  </div>

                  {/* Espaçador para o outro lado */}
                  <div className="hidden md:block w-[45%]" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Módulo de Quiz Interativo (O Cristal de Energia) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-32 relative group"
        >
          <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] rounded-full group-hover:bg-emerald-500/20 transition-colors" />
          
          <div className="relative p-1 border border-emerald-500/20 rounded-[3rem] bg-[#0a201c]/80 backdrop-blur-2xl">
            <div className="p-12 text-center rounded-[2.8rem] border border-emerald-400/10">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/40">
                <Puzzle className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-emerald-50">Sincronizar Conhecimento</h3>
              <p className="text-emerald-100/40 mb-10 max-w-md mx-auto">
                Ao completar este desafio, você desbloqueia o próximo nível da jornada ambiental e consolida seu aprendizado.
              </p>

              <Button
                onClick={() => setShowQuiz(true)}
                className={`
                  h-16 px-12 rounded-2xl text-lg font-black tracking-widest transition-all duration-500
                  ${isCompleted(4) 
                    ? "bg-emerald-500 text-[#061512]" 
                    : "bg-transparent border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-[#061512] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"}
                `}
              >
                {isCompleted(4) ? "MISSÃO CUMPRIDA ✓" : "INICIAR DESAFIO"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showQuiz && <QuizModal sectionIndex={4} onClose={() => setShowQuiz(false)} />}
      </AnimatePresence>
    </section>
  );
}