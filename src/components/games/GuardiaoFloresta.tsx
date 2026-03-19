import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Cloud, TreeDeciduous, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Árvore Dinâmica Ajustada ---
const Tree = ({ quality }: { quality: number }) => {
  const variants = {
    3: { height: "h-32", color: "bg-emerald-600", label: "Forte 🌳", emoji: "🌳" }, // ACERTO NO AMARELO (Médio)
    2: { height: "h-48", color: "bg-emerald-500", label: "Lendária 🌲", emoji: "🌲" }, // ACERTO NO VERDE (Grande)
    1: { height: "h-16", color: "bg-green-700", label: "Muda 🌱", emoji: "🌱" },    // ERRO/FORA (Pequena)
  };
  const config = variants[quality as keyof typeof variants] || variants[1];

  return (
    <motion.div 
      initial={{ scale: 0, y: 50 }} 
      animate={{ scale: 1, y: 0 }}
      className="relative flex flex-col items-center group"
    >
      <div className={`absolute -top-10 text-[10px] font-black text-white/60 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm`}>
        {config.label}
      </div>
      
      <div className={`relative ${config.height} flex flex-col items-center justify-end`}>
        {/* Folhagem */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className={`w-24 h-24 rounded-full ${config.color} blur-sm opacity-80 mb-[-30px] shadow-2xl shadow-emerald-900/40`} 
        />
        <div className={`w-16 h-16 rounded-full ${config.color} opacity-90 mb-[-15px]`} />
        
        {/* Tronco */}
        <div className="w-4 h-full bg-[#451a03] rounded-t-lg shadow-xl relative z-10" />
      </div>
    </motion.div>
  );
};

export default function FlorestaViva({ onExit, onXP }: { onExit: () => void; onXP: (n: number) => void }) {
  const [trees, setTrees] = useState<{ quality: number; id: number }[]>([]);
  const [barPos, setBarPos] = useState(0);
  const [isPlanting, setIsPlanting] = useState(false);
  const [combo, setCombo] = useState(0);
  const [sessionXP, setSessionXP] = useState(0); // XP ACUMULADO NA SESSÃO
  const [showSummary, setShowSummary] = useState(false);
  
  const barDir = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Movimento da Barra
  useEffect(() => {
    const speed = 2.8; 
    const interval = setInterval(() => {
      setBarPos((prev) => {
        let next = prev + (barDir.current * speed);
        if (next >= 100) { barDir.current = -1; next = 100; }
        if (next <= 0) { barDir.current = 1; next = 0; }
        return next;
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll para a direita
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' });
    }
  }, [trees]);

  const handleAction = () => {
    if (isPlanting || showSummary) return;
    setIsPlanting(true);

    const pos = barPos;
    let quality = 1;
    let xpGanho = 0;

    // Lógica de Cores e Tamanhos conforme solicitado:
    if (pos >= 44 && pos <= 56) {
      // ACERTO NO AMARELO (Centro) -> Fica menor (Strong 🌳)
      quality = 3; 
      xpGanho = 50; 
      setCombo(c => c + 1);
    } else if (pos >= 25 && pos <= 75) {
      // ACERTO NO VERDE (Lados) -> Fica a árvore grande (Legendary 🌲)
      quality = 2; 
      xpGanho = 20; 
      setCombo(0);
    } else {
      // ERRO (Fora) -> Fica o brotinho (Muda 🌱)
      quality = 1; 
      xpGanho = 5; 
      setCombo(0);
    }

    setSessionXP(prev => prev + xpGanho);
    setTrees(prev => [...prev, { quality, id: Date.now() }]);
    
    setTimeout(() => setIsPlanting(false), 300);
  };

  const finishGame = () => {
    setShowSummary(true);
  };

  const handleCollectAndExit = () => {
    onXP(sessionXP); // Manda o XP total de uma vez só
    onExit();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-400 to-emerald-100 overflow-hidden flex flex-col font-sans">
      
      {/* HUD Superior */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
        <Button 
          variant="ghost" 
          onClick={onExit} 
          className="bg-white/20 backdrop-blur-md rounded-full text-sky-900 font-black px-6 hover:bg-white/40"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> SAIR
        </Button>
        
        <div className="flex gap-4">
          <div className="bg-white/40 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/40 text-emerald-900 font-black shadow-lg">
            XP: <span className="text-emerald-600">{sessionXP}</span>
          </div>
          <Button 
            onClick={finishGame}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg border-b-4 border-emerald-800"
          >
            FINALIZAR MISSÃO
          </Button>
        </div>
      </div>

      {/* Cenário Ativo */}
      <div className="flex-1 relative flex flex-col justify-end">
        {/* Nuvens */}
        <div className="absolute top-32 w-full flex justify-around opacity-30 pointer-events-none">
          <motion.div animate={{ x: [-20, 20, -20] }} transition={{ duration: 10, repeat: Infinity }}><Cloud size={100} className="text-white" /></motion.div>
          <motion.div animate={{ x: [20, -20, 20] }} transition={{ duration: 15, repeat: Infinity }}><Cloud size={150} className="text-white mt-10" /></motion.div>
        </div>

        {/* Zona de Plantio */}
        <div ref={scrollRef} className="w-full overflow-x-auto no-scrollbar pb-0">
          <div className="flex items-end px-[50vw] min-w-max h-[450px] gap-8">
            {trees.map((tree) => (
              <Tree key={tree.id} quality={tree.quality} />
            ))}
            
            <div className="w-32 flex flex-col items-center opacity-20">
               <TreeDeciduous size={60} className="text-emerald-900 animate-bounce mb-4" />
               <div className="w-20 h-3 bg-emerald-900/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Chão */}
        <div className="h-32 bg-[#4ade80] w-full relative border-t-8 border-emerald-500 shadow-[0_-10px_40px_rgba(16,185,129,0.2)]">
           <div className="absolute top-0 left-0 right-0 h-16 bg-stone-300 border-b-4 border-stone-400">
              <div className="flex w-full h-full">
                {[...Array(60)].map((_, i) => (
                  <div key={i} className="min-w-[80px] h-full border-r border-stone-400/30" />
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* Painel de Controle */}
      <div className="bg-slate-900 p-10 flex flex-col items-center border-t-8 border-slate-800">
        <div className="w-full max-w-2xl">
          
          <div className="relative h-20 bg-black/60 rounded-[2rem] mb-8 border-4 border-slate-700 overflow-hidden">
            {/* ZONA VERDE (Qualidade 2 - Árvore Grande) */}
            <div className="absolute inset-y-0 left-[25%] right-[25%] bg-emerald-500/30" />
            
            {/* ZONA AMARELA (Qualidade 3 - Árvore Média) */}
            <div className="absolute inset-y-0 left-[44%] right-[44%] bg-yellow-400 shadow-[0_0_30px_#facc15] z-10" />
            
            {/* Marcador */}
            <motion.div
              className="absolute top-0 bottom-0 w-3 bg-white shadow-[0_0_20px_#fff] z-20"
              style={{ left: `${barPos}%`, transform: 'translateX(-50%)' }}
            />
          </div>

          <button
            onMouseDown={handleAction}
            disabled={isPlanting || showSummary}
            className={`w-full py-10 rounded-[2.5rem] text-4xl font-black uppercase tracking-tighter transition-all
              ${isPlanting 
                ? 'bg-slate-800 text-slate-600 scale-95' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-[0_12px_0_rgb(5,150,105)] active:translate-y-2 active:shadow-none'}
            `}
          >
            {isPlanting ? (
              <span className="flex items-center justify-center gap-4">
                <Zap className="animate-pulse" /> CRESCENDO...
              </span>
            ) : "PLANTAR AGORA!"}
          </button>
          
          <p className="text-center text-slate-500 font-black mt-6 text-xs uppercase tracking-[0.4em]">
            Alvo: <span className="text-yellow-500">Amarelo = Forte</span> | <span className="text-emerald-500">Verde = Grande</span>
          </p>
        </div>
      </div>

      {/* MODAL DE FINALIZAÇÃO (RESUMO) */}
      <AnimatePresence>
        {showSummary && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 100 }} animate={{ scale: 1, y: 0 }}
              className="bg-slate-900 border-4 border-emerald-500 rounded-[3rem] p-12 text-center max-w-md w-full shadow-2xl"
            >
              <Trophy className="h-20 w-20 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-4xl font-black text-white mb-2 italic">FLORESTA RECUPERADA!</h2>
              <p className="text-slate-400 font-bold mb-8 uppercase tracking-widest text-sm">Missão Finalizada com Sucesso</p>
              
              <div className="space-y-4 mb-10">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl">
                  <p className="text-xs font-black text-emerald-500 uppercase mb-1">XP ACUMULADO</p>
                  <p className="text-6xl font-black text-white">+{sessionXP}</p>
                </div>
                <div className="flex justify-center gap-2">
                  <div className="bg-slate-800 px-4 py-2 rounded-full text-white font-bold text-sm">
                    {trees.length} Árvores Plantadas
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCollectAndExit}
                className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-2xl rounded-3xl shadow-[0_8px_0_#065f46] active:translate-y-2 active:shadow-none transition-all"
              >
                COLETAR E VOLTAR
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