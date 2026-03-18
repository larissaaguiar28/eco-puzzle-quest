import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft, Trophy, Heart, Timer, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onExit: () => void;
  onXP: (amount: number) => void;
}

interface OceanObject {
  id: number;
  x: number;
  y: number;
  type: "trash" | "animal";
  emoji: string;
  speed: number;
  wobble: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

const TRASH = ["🥤", "🛍️", "🧴", "📦", "🥡", "🪣", "🥫", "👟", "🔋", "🛢️"];
const ANIMALS = ["🐟", "🐢", "🐠", "🦈", "🐙", "🦀", "🐬", "🐳", "🐡", "🦑"];

export default function OceanoLimpoSideScroller({ onExit, onXP }: Props) {
  // A MÁGICA CONTRA O LAG ESTÁ AQUI: useMotionValue ignora o ciclo de renderização do React!
  const playerY = useMotionValue(50);
  const playerRotation = useMotionValue(0);
  const playerTop = useTransform(playerY, (y) => `${y}%`);

  const [objects, setObjects] = useState<OceanObject[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [bubbles, setBubbles] = useState<{id: number, x: number, size: number}[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(60);
  const [lastAction, setLastAction] = useState<"hit" | "miss" | null>(null);
  const [shake, setShake] = useState(false);
  
  const nextId = useRef(0);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  
  const timerRef = useRef(timer);
  useEffect(() => { timerRef.current = timer; }, [timer]);

  const createParticles = (x: number, y: number, color: string) => {
    const newParticles = Array.from({ length: 8 }).map(() => ({
      id: Math.random(), x, y, color
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => setParticles(prev => prev.filter(p => !newParticles.includes(p))), 600);
  };

  // MOTOR DE FÍSICA E MOVIMENTO (Rodando a 60fps lisos via requestAnimationFrame)
  useEffect(() => {
    if (gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.key] = false; };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    let animationFrameId: number;

    const gameLoop = () => {
      // 1. ATUALIZA O BARCO (Sem travar o React)
      const speed = 0.8;
      let currentY = playerY.get();
      let targetRot = 0;

      if (keysPressed.current["ArrowUp"]) {
        currentY = Math.max(10, currentY - speed);
        targetRot = -15;
      } else if (keysPressed.current["ArrowDown"]) {
        currentY = Math.min(90, currentY + speed);
        targetRot = 15;
      }
      
      playerY.set(currentY);
      
      // Interpolação suave de rotação (suaviza o "embicar" do barco)
      const currentRot = playerRotation.get();
      playerRotation.set(currentRot + (targetRot - currentRot) * 0.15);

      // 2. ATUALIZA OS OBJETOS E VERIFICA COLISÃO
      setObjects((prev) => {
        const next: OceanObject[] = [];
        for (const obj of prev) {
          const newX = obj.x - obj.speed;
          const newWobble = obj.wobble + 0.05; 
          
          const boatX = 15;
          
          // Lendo a posição exata do barco direto do MotionValue
          if (newX <= boatX + 6 && newX >= boatX - 6 && Math.abs(obj.y - currentY) < 10) {
            if (obj.type === "trash") {
              setScore(s => s + 1);
              setLastAction("hit");
              createParticles(boatX + 5, currentY, "#4ade80");
              onXP(5);
            } else {
              setLives(l => l - 1);
              setLastAction("miss");
              setShake(true);
              createParticles(boatX + 5, currentY, "#ef4444");
              setTimeout(() => setShake(false), 300);
            }
            setTimeout(() => setLastAction(null), 400);
            continue; // Se colidiu, não põe na tela (destrói o objeto)
          }
          if (newX < -10) continue; // Remove objetos fora da tela
          next.push({ ...obj, x: newX, wobble: newWobble });
        }
        return next;
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    // Inicia o loop nativo do navegador
    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameOver, playerY, playerRotation, onXP]);

  // Spawn de Objetos 
  useEffect(() => {
    if (gameOver) return;
    const spawnRateMs = 2000; 

    const interval = setInterval(() => {
      const isTrash = Math.random() > 0.4;
      const pool = isTrash ? TRASH : ANIMALS;
      const speedMultiplier = 1 + ((60 - timerRef.current) / 100);

      setObjects((prev) => [
        ...prev,
        {
          id: nextId.current++,
          x: 110,
          y: 10 + Math.random() * 80,
          type: (isTrash ? "trash" : "animal") as "trash" | "animal", 
          emoji: pool[Math.floor(Math.random() * pool.length)],
          speed: (0.3 + Math.random() * 0.2) * speedMultiplier,
          wobble: Math.random() * Math.PI * 2,
        }
      ].slice(-25));
    }, spawnRateMs); 
    
    return () => clearInterval(interval);
  }, [gameOver]);

  // Gerador de Bolhas Decorativas
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setBubbles(prev => [
        ...prev, 
        { id: Math.random(), x: Math.random() * 100, size: Math.random() * 10 + 5 }
      ].slice(-15));
    }, 400);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Timer
  useEffect(() => {
    if (gameOver) return;
    const t = setInterval(() => setTimer(p => (p <= 1 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, [gameOver]);

  useEffect(() => { if (lives <= 0 || timer === 0) setGameOver(true); }, [lives, timer]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 font-sans select-none overflow-hidden flex flex-col items-center">
      
      {/* HUD Superior */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-4 bg-slate-900/60 backdrop-blur-xl px-8 py-4 rounded-full border border-cyan-900/50 shadow-[0_0_30px_rgba(6,182,212,0.1)] z-50">
        <button onClick={onExit} className="flex items-center gap-2 text-cyan-500 hover:text-cyan-300 uppercase text-sm font-black tracking-widest transition-all">
          <ArrowLeft className="h-5 w-5" /> Abandonar
        </button>
        
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <Timer className={`h-6 w-6 ${timer <= 10 ? "text-red-500 animate-pulse" : "text-cyan-400"}`} />
            <span className={`font-mono text-3xl font-black ${timer <= 10 ? "text-red-500" : "text-white"}`}>
              {timer}s
            </span>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-950/50 px-6 py-2 rounded-full border border-slate-800">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <motion.span key={score} animate={{ scale: [1, 1.5, 1] }} className="font-mono text-2xl font-black text-yellow-400">
              {score.toString().padStart(3, '0')}
            </motion.span>
          </div>
          
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div key={i} animate={i >= lives ? { scale: 0, opacity: 0 } : { scale: 1 }}>
                <Heart className="h-6 w-6 fill-red-500 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.div 
        animate={shake ? { x: [-15, 15, -15, 15, 0], transition: { duration: 0.3 } } : {}}
        className="w-full max-w-5xl relative"
      >
        <div className="relative rounded-[2rem] border-4 border-slate-800/80 h-[550px] overflow-hidden shadow-[0_0_100px_rgba(14,165,233,0.15)] bg-[#041d33]">
          
          {/* Fundos Parallax */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#0e7490_0%,_#020617_100%)] opacity-80" />
          <motion.div 
            animate={{ x: [0, -1000] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #38bdf8 2px, transparent 2px)', backgroundSize: '40px 40px' }}
          />
          <motion.div 
            animate={{ x: [0, -1000] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #7dd3fc 3px, transparent 3px)', backgroundSize: '100px 100px', backgroundPosition: '20px 20px' }}
          />

          {/* Bolhas Subindo */}
          <AnimatePresence>
            {bubbles.map(b => (
              <motion.div
                key={b.id}
                initial={{ y: "110%", x: `${b.x}%`, opacity: 0 }} animate={{ y: "-10%", x: `${b.x + (Math.random() * 5 - 2.5)}%`, opacity: 0.6 }} exit={{ opacity: 0 }}
                transition={{ duration: 4 + Math.random() * 2, ease: "easeIn" }}
                className="absolute rounded-full border border-cyan-200/50 bg-cyan-200/10" style={{ width: b.size, height: b.size }}
              />
            ))}
          </AnimatePresence>

          {/* Partículas de Colisão */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ x: `${p.x}%`, y: `${p.y}%`, scale: 1, opacity: 1 }}
              animate={{ x: `${p.x + (Math.random() - 0.5) * 20}%`, y: `${p.y + (Math.random() - 0.5) * 20}%`, scale: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute z-50 drop-shadow-[0_0_10px_currentColor]" style={{ color: p.color }}
            >
              <Star className="h-5 w-5 fill-current" />
            </motion.div>
          ))}

          {/* Objetos na Água */}
          <AnimatePresence>
            {!gameOver && objects.map((obj) => (
              <motion.div
                key={obj.id}
                className="absolute text-5xl pointer-events-none z-20 flex items-center justify-center"
                style={{ 
                  left: `${obj.x}%`, 
                  top: `calc(${obj.y}% + ${Math.sin(obj.wobble) * 3}%)`, 
                  transform: "translate(-50%, -50%)" 
                }}
                animate={{ rotate: obj.type === 'trash' ? [0, 360] : Math.sin(obj.wobble) * 15 }}
                transition={{ rotate: { duration: obj.type === 'trash' ? 5 : 0, repeat: Infinity, ease: "linear" } }}
                exit={{ scale: 0, opacity: 0, filter: "brightness(2)" }}
              >
                <div className={`drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] ${obj.type === 'animal' && obj.speed > 0.8 ? 'scale-x-[-1]' : ''}`}>
                  {obj.emoji}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* O BARCO DO JOGADOR OTIMIZADO */}
          {!gameOver && (
            <motion.div
              className="absolute z-40"
              style={{ 
                left: "15%",
                top: playerTop, // Usa a variável nativa sem forçar React render
                rotate: playerRotation,
                x: "-50%",
                y: "-50%",
                filter: lastAction === "hit" ? "brightness(1.5) drop-shadow(0 0 30px #4ade80)" : lastAction === "miss" ? "brightness(0.5) hue-rotate(-50deg)" : "brightness(1)"
              }}
              animate={{ scale: lastAction === "hit" ? [1, 1.2, 1] : 1 }}
              transition={{ scale: { duration: 0.2 } }}
            >
              <div className="relative">
                <span className="text-7xl block drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] filter transition-all">
                  🛥️
                </span>
                
                <div className="absolute -left-8 top-[60%] -translate-y-1/2 flex gap-1">
                   {[...Array(6)].map((_, i) => (
                     <motion.div 
                        key={i}
                        animate={{ opacity: [0, 0.6, 0], scale: [0.2, 1.5, 0.5], x: [0, -30 - (i * 15)], y: [0, (Math.random() - 0.5) * 15] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }}
                        className="w-3 h-3 bg-cyan-100 rounded-full blur-[2px]"
                     />
                   ))}
                </div>

                <AnimatePresence>
                  {lastAction && (
                    <motion.div 
                      initial={{ y: -20, opacity: 0, scale: 0 }}
                      animate={{ y: -60, opacity: 1, scale: 1.5 }}
                      exit={{ opacity: 0, y: -80 }}
                      transition={{ duration: 0.4 }}
                      className={`absolute left-[80%] font-black text-4xl italic drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] ${lastAction === 'hit' ? 'text-green-400' : 'text-red-500'}`}
                    >
                      {lastAction === 'hit' ? '+1' : '-1 ❤️'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Tela de Game Over */}
          <AnimatePresence>
            {gameOver && (
               <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
               >
                 <motion.div 
                  initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }}
                  className="bg-slate-900/90 border-2 border-cyan-500/50 rounded-3xl p-10 text-center shadow-[0_0_80px_rgba(6,182,212,0.2)] max-w-md w-full"
                 >
                   <div className="bg-cyan-950/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
                     <Sparkles className="h-12 w-12 text-cyan-400" />
                   </div>
                   <h3 className="text-3xl font-black mb-1 text-white uppercase tracking-wider">
                     {lives <= 0 ? "Missão Falhou" : "Tempo Esgotado!"}
                   </h3>
                   <p className="text-slate-400 text-sm mb-8">
                     {lives <= 0 ? "Você colidiu com muitos animais marinhos." : "O turno de limpeza terminou."}
                   </p>
                   
                   <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Lixo Coletado</p>
                        <p className="text-4xl font-black text-cyan-400">{score}</p>
                      </div>
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">XP Ganho</p>
                        <p className="text-4xl font-black text-green-400">+{score * 10}</p>
                      </div>
                   </div>
                   
                   <div className="flex gap-3">
                     <Button variant="outline" onClick={onExit} className="flex-1 border-slate-700 hover:bg-slate-800 text-white">
                        Sair
                     </Button>
                     <Button onClick={() => window.location.reload()} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                        Jogar Novamente
                     </Button>
                   </div>
                 </motion.div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      <p className="mt-6 text-cyan-500/50 text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-2">
        <span className="w-4 h-px bg-cyan-500/30"></span>
        Use [↑] e [↓] para limpar o oceano
        <span className="w-4 h-px bg-cyan-500/30"></span>
      </p>
    </div>
  );
}