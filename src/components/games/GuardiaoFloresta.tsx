import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Cloud, TreeDeciduous, Sparkles, Trophy, Flame, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- COMPONENTE DA ÁRVORE (AGORA MAIOR E MAIS BONITA) ---
const Tree = ({ type, floatingText }: { type: 'perfect' | 'good' | 'miss', floatingText: string }) => {
  const configs = {
    perfect: { 
      height: "h-80", // Muito maior
      trunk: "h-28 w-8",
      trunkColor: "bg-[#4a2411] border-r-8 border-[#30160a]",
      label: "LENDÁRIA!", 
      labelColor: "text-yellow-400",
      crown: (
        <div className="relative w-56 h-56 flex items-center justify-center mb-[-40px] z-10">
          {/* Camadas da folhagem para dar volume */}
          <div className="absolute w-56 h-56 bg-gradient-to-tr from-emerald-600 to-green-300 rounded-[40%] rotate-45 shadow-[0_0_50px_rgba(52,211,153,0.8)]" />
          <div className="absolute w-48 h-48 top-[-30px] bg-gradient-to-tl from-emerald-500 to-green-200 rounded-full" />
          <div className="absolute w-32 h-32 right-[-20px] bg-gradient-to-bl from-emerald-400 to-yellow-300 rounded-full opacity-90" />
          <Sparkles className="absolute -top-8 -right-4 text-yellow-300 animate-pulse drop-shadow-lg" size={48} />
        </div>
      )
    },
    good: { 
      height: "h-52", // Maior que a anterior
      trunk: "h-20 w-6",
      trunkColor: "bg-[#5c2a0d] border-r-4 border-[#3b1906]",
      label: "BOM!", 
      labelColor: "text-white",
      crown: (
        <div className="relative w-36 h-36 flex items-center justify-center mb-[-25px] z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-green-700 to-green-500 rounded-full shadow-2xl" />
          <div className="absolute w-28 h-28 top-[-15px] left-2 bg-gradient-to-tr from-green-600 to-green-400 rounded-full" />
          <div className="absolute w-20 h-20 top-2 right-0 bg-gradient-to-bl from-green-500 to-green-300 rounded-full" />
        </div>
      )
    },
    miss: { 
      height: "h-16", 
      trunk: "h-6 w-3",
      trunkColor: "bg-[#5c2a0d]",
      label: "ERROU...", 
      labelColor: "text-red-400",
      crown: (
        <div className="w-12 h-12 bg-gradient-to-t from-lime-800 to-lime-600 rounded-full mb-[-10px] opacity-90 z-10 shadow-sm" />
      )
    },
  };
  
  const config = configs[type];

  return (
    <motion.div 
      initial={{ scale: 0, y: 50, opacity: 0 }} 
      animate={{ scale: 1, y: 0, opacity: 1 }}
      className={`relative flex flex-col items-center justify-end w-40 ${config.height}`}
    >
      {/* Texto Flutuante de XP */}
      {floatingText && (
        <motion.div 
          initial={{ y: 0, opacity: 1, scale: 0.5 }}
          animate={{ y: -80, opacity: 0, scale: 1.5 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`absolute top-0 font-black text-2xl z-50 drop-shadow-md ${config.labelColor}`}
        >
          {floatingText}
        </motion.div>
      )}

      {/* Label de Feedback */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: -20 }}
        transition={{ delay: 0.2 }}
        className={`absolute top-10 text-[12px] font-black uppercase tracking-widest bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-sm ${config.labelColor} z-20 shadow-xl border border-white/10`}
      >
        {config.label}
      </motion.div>
      
      {/* Visual da Árvore */}
      <div className={`relative flex flex-col items-center justify-end w-full`}>
        {type !== 'miss' ? (
          <motion.div 
            animate={{ scale: [1, 1.02, 1], rotate: [0, 1, -1, 0] }}
            transition={{ repeat: Infinity, duration: type === 'perfect' ? 3 : 5 }}
            className="z-10"
          >
            {config.crown}
          </motion.div>
        ) : (
          config.crown
        )}
        
        {/* Tronco */}
        <div className={`${config.trunk} ${config.trunkColor} rounded-t-sm relative z-0`} />
        
        {/* Graminha na base */}
        <div className="absolute bottom-0 w-16 h-4 bg-emerald-700 rounded-full blur-[3px] z-20" />
      </div>
    </motion.div>
  );
};

// --- JOGO PRINCIPAL ---
export default function FlorestaViva({ onExit, onXP }: { onExit: () => void; onXP: (n: number) => void }) {
  const [trees, setTrees] = useState<{ id: number; type: 'perfect' | 'good' | 'miss'; xp: string }[]>([]);
  const [barPos, setBarPos] = useState(0);
  const [isPlanting, setIsPlanting] = useState(false);
  const [combo, setCombo] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  
  // NOVO: Cronômetro de 30 segundos
  const [timeLeft, setTimeLeft] = useState(30);
  
  const reqRef = useRef<number>();
  const posRef = useRef(0);
  const dirRef = useRef(1);
  const speedRef = useRef(1.5);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Timer Lógica
  useEffect(() => {
    if (showSummary) return;
    
    if (timeLeft <= 0) {
      setShowSummary(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showSummary]);

  // Loop da Barra
  useEffect(() => {
    const animateBar = () => {
      if (showSummary) return; // Para a barra se o jogo acabou

      posRef.current += dirRef.current * speedRef.current;
      if (posRef.current >= 100) { dirRef.current = -1; posRef.current = 100; }
      if (posRef.current <= 0) { dirRef.current = 1; posRef.current = 0; }
      
      setBarPos(posRef.current);
      reqRef.current = requestAnimationFrame(animateBar);
    };
    
    if (!showSummary) {
      reqRef.current = requestAnimationFrame(animateBar);
    }
    
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [showSummary]);

  // Velocidade pelo combo
  useEffect(() => {
    const newSpeed = 1.5 + (combo * 0.35);
    speedRef.current = Math.min(newSpeed, 4.5);
  }, [combo]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' });
    }
  }, [trees]);

  const handleAction = () => {
    if (isPlanting || showSummary || timeLeft <= 0) return;
    setIsPlanting(true);

    const pos = posRef.current;
    let type: 'perfect' | 'good' | 'miss' = 'miss';
    let xpGanho = 0;
    let text = "0 XP";

    if (pos >= 42 && pos <= 58) {
      type = 'perfect'; xpGanho = 50; text = "+50 XP"; setCombo(c => c + 1);
    } else if (pos >= 20 && pos <= 80) {
      type = 'good'; xpGanho = 20; text = "+20 XP"; setCombo(c => c + 1);
    } else {
      type = 'miss'; xpGanho = 0; text = "ERRÔ"; setCombo(0);
    }

    setSessionXP(prev => prev + xpGanho);
    setTrees(prev => [...prev, { id: Date.now(), type, xp: text }]);
    
    setTimeout(() => setIsPlanting(false), 250);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-400 via-sky-300 to-emerald-200 overflow-hidden flex flex-col font-sans select-none">
      
      {/* HUD SUPERIOR */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-50">
        <Button 
          variant="ghost" 
          onClick={onExit} 
          className="bg-white/30 backdrop-blur-md rounded-2xl text-sky-900 font-black px-6 hover:bg-white/50 transition-all shadow-sm"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> FUGIR
        </Button>
        
        {/* NOVO: Cronômetro Central */}
        <div className="absolute left-1/2 -translate-x-1/2 top-6">
          <div className={`flex items-center gap-2 px-6 py-3 rounded-3xl font-black text-2xl shadow-xl border-4 transition-colors duration-300 ${
            timeLeft <= 5 
              ? "bg-red-500 text-white border-red-300 animate-pulse scale-110" 
              : "bg-slate-900 text-white border-slate-700"
          }`}>
            <Clock size={24} className={timeLeft <= 5 ? "animate-spin" : ""} />
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="bg-white/90 backdrop-blur-md px-8 py-3 rounded-3xl border-2 border-white text-emerald-900 font-black shadow-xl text-xl">
            XP: <span className="text-emerald-600 ml-1">{sessionXP}</span>
          </div>

          <AnimatePresence>
            {combo > 1 && (
              <motion.div 
                initial={{ scale: 0, x: 50 }} animate={{ scale: 1, x: 0 }} exit={{ scale: 0 }}
                className="flex items-center gap-2 bg-orange-500 text-white px-4 py-1.5 rounded-full font-black shadow-lg border-2 border-orange-300"
              >
                <Flame size={18} className="animate-pulse" />
                COMBO x{combo}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CENÁRIO */}
      <div className="flex-1 relative flex flex-col justify-end">
        <div className="absolute top-10 w-full flex justify-around opacity-40 pointer-events-none">
          <motion.div animate={{ x: [-30, 30, -30] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}><Cloud size={160} className="text-white" /></motion.div>
          <motion.div animate={{ x: [30, -30, 30] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}><Cloud size={250} className="text-white mt-20" /></motion.div>
        </div>

        {/* Zona de Plantio Aumentada para caber as árvores gigantes */}
        <div ref={scrollRef} className="w-full overflow-x-auto no-scrollbar pb-0">
          <div className="flex items-end px-[50vw] min-w-max h-[450px]"> 
            {trees.map((tree) => (
              <Tree key={tree.id} type={tree.type} floatingText={tree.xp} />
            ))}
            
            {/* Próximo Local */}
            <div className="w-40 h-64 flex flex-col items-center justify-end relative">
              <motion.div 
                animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-20 flex flex-col items-center opacity-40 text-emerald-800"
              >
                <span className="text-sm font-black bg-white/60 px-3 py-1 rounded-full mb-3 shadow-sm">AQUI</span>
                <TreeDeciduous size={50} />
              </motion.div>
              <div className="w-20 h-5 bg-emerald-900/20 rounded-[100%] border-b-2 border-emerald-900/10 mb-[-8px]" />
            </div>
          </div>
        </div>

        <div className="h-32 bg-[#34d399] w-full relative border-t-[16px] border-emerald-500 shadow-[0_-20px_50px_rgba(16,185,129,0.3)] z-10">
           <div className="absolute top-4 left-0 right-0 bottom-0 bg-[#8b5a2b] border-t-8 border-[#734a24] opacity-90">
              <div className="w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#4a2f16 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
           </div>
        </div>
      </div>

      {/* PAINEL DA BARRA */}
      <div className="bg-slate-900 p-8 pb-12 flex flex-col items-center relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.6)]">
        <div className="w-full max-w-3xl">
          
          <div className="flex justify-between text-slate-400 text-xs font-black uppercase tracking-widest mb-3 px-4">
            <span>Erro</span>
            <span className="text-emerald-400">Bom</span>
            <span className="text-yellow-400">Perfeito</span>
            <span className="text-emerald-400">Bom</span>
            <span>Erro</span>
          </div>

          <div className="relative h-20 bg-red-500/20 rounded-[2rem] mb-6 border-4 border-slate-800 overflow-hidden shadow-inner">
            <div className="absolute inset-y-0 left-[20%] right-[20%] bg-emerald-500 shadow-[inset_0_0_20px_rgba(4,120,87,0.5)]" />
            <div className="absolute inset-y-0 left-[42%] right-[42%] bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,1)] z-10" />
            
            <div
              className="absolute top-0 bottom-0 w-3 bg-white rounded-full shadow-[0_0_20px_#fff] z-20 pointer-events-none"
              style={{ left: `${barPos}%`, transform: 'translateX(-50%)' }}
            />
          </div>

          <button
            onMouseDown={handleAction}
            onTouchStart={(e) => { e.preventDefault(); handleAction(); }}
            disabled={isPlanting || showSummary || timeLeft <= 0}
            className={`w-full py-8 rounded-[2rem] text-4xl font-black uppercase tracking-tighter transition-all flex justify-center items-center gap-4
              ${(isPlanting || timeLeft <= 0)
                ? 'bg-slate-800 text-slate-600 scale-95' 
                : 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950 shadow-[0_12px_0_rgb(4,120,87)] active:translate-y-3 active:shadow-none'}
            `}
          >
            {timeLeft <= 0 ? "TEMPO ESGOTADO!" : isPlanting ? <Zap className="animate-pulse" size={36} /> : "PLANTAR AGORA!"}
          </button>
        </div>
      </div>

      {/* MODAL DE RESUMO */}
      <AnimatePresence>
        {showSummary && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }}
              className="bg-slate-800 border-4 border-emerald-500 rounded-[3rem] p-10 text-center max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #34d399 2px, transparent 2px)', backgroundSize: '30px 30px' }} />

              <Trophy className="h-28 w-28 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
              <h2 className="text-5xl font-black text-white mb-2 tracking-tight italic">TEMPO!</h2>
              <p className="text-emerald-400 font-bold mb-8 uppercase tracking-widest text-sm">A Floresta Cresceu</p>
              
              <div className="bg-slate-900 border-2 border-slate-700 p-8 rounded-3xl mb-8 relative z-10 shadow-inner">
                <p className="text-sm font-black text-slate-400 uppercase mb-2">XP Arrecadado em 30s</p>
                <p className="text-7xl font-black text-emerald-400 mb-6">{sessionXP}</p>
                
                <div className="grid grid-cols-3 gap-2 text-sm text-slate-300 font-bold border-t border-slate-700 pt-4">
                  <div className="flex flex-col"><span className="text-yellow-400 text-xl">{trees.filter(t => t.type === 'perfect').length}</span>Lendárias</div>
                  <div className="flex flex-col border-x border-slate-700"><span className="text-emerald-400 text-xl">{trees.filter(t => t.type === 'good').length}</span>Comuns</div>
                  <div className="flex flex-col"><span className="text-red-400 text-xl">{trees.filter(t => t.type === 'miss').length}</span>Erros</div>
                </div>
              </div>

              <Button 
                onClick={() => { onXP(sessionXP); onExit(); }}
                className="w-full h-20 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-2xl rounded-2xl shadow-[0_8px_0_#065f46] active:translate-y-2 active:shadow-none transition-all relative z-10"
              >
                RESGATAR E SAIR
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}