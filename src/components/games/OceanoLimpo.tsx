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
  iconIndex: number;
  speed: number;
  wobble: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

const PlasticCup = () => (
  <svg viewBox="0 0 100 100" className="w-[50px] h-[50px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
    <path d="M25,20 L35,85 A5,5 0 0,0 40,90 L60,90 A5,5 0 0,0 65,85 L75,20 Z" fill="#EF4444" />
    <ellipse cx="50" cy="20" rx="27" ry="5" fill="#DC2626" />
    <ellipse cx="50" cy="19" rx="27" ry="5" fill="#EF4444" />
    <line x1="30" y1="55" x2="70" y2="55" stroke="#DC2626" strokeWidth="3" />
  </svg>
);

const PlasticBag = () => (
  <svg viewBox="0 0 100 100" className="w-[50px] h-[50px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
    <path d="M30,40 C10,90 90,90 70,40 Z" fill="#cbd5e1" opacity="0.9" />
    <path d="M40,40 Q30,10 50,40" fill="none" stroke="#cbd5e1" strokeWidth="6" />
    <path d="M60,40 Q70,10 50,40" fill="none" stroke="#cbd5e1" strokeWidth="6" />
    <path d="M30,40 C10,90 90,90 70,40 Z" fill="none" stroke="#94a3b8" strokeWidth="2" opacity="0.5" />
  </svg>
);

const CanItem = () => (
  <svg viewBox="0 0 100 100" className="w-[50px] h-[50px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
    <rect x="25" y="25" width="50" height="50" rx="2" fill="#94a3b8" />
    <rect x="25" y="35" width="50" height="25" fill="#ef4444" />
    <ellipse cx="50" cy="25" rx="25" ry="6" fill="#cbd5e1" />
    <ellipse cx="50" cy="75" rx="25" ry="6" fill="#94a3b8" />
    <ellipse cx="50" cy="25" rx="12" ry="3" fill="#64748b" />
  </svg>
);

const FishItem = () => (
  <svg viewBox="0 0 100 100" className="w-[55px] h-[55px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
    <path d="M 80,50 L 95,30 L 95,70 Z" fill="#fb923c" />
    <path d="M 80,50 C 40,20 10,40 20,50 C 10,60 40,80 80,50 Z" fill="#fb923c" />
    <circle cx="35" cy="45" r="4" fill="#1e293b" />
    <path d="M 50,45 Q 60,35 70,45 Z" fill="#ea580c" />
  </svg>
);

const TurtleItem = () => (
  <svg viewBox="0 0 100 100" className="w-[55px] h-[55px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
    <path d="M 30,30 Q 10,20 20,40 Z" fill="#22c55e" />
    <path d="M 70,30 Q 90,20 80,40 Z" fill="#22c55e" />
    <path d="M 35,70 Q 20,80 30,85 Z" fill="#22c55e" />
    <path d="M 65,70 Q 80,80 70,85 Z" fill="#22c55e" />
    <circle cx="50" cy="15" r="10" fill="#22c55e" />
    <ellipse cx="50" cy="50" rx="25" ry="35" fill="#16a34a" />
    <path d="M 50,15 C 30,15 30,85 50,85 C 70,85 70,15 50,15 Z" fill="none" stroke="#15803d" strokeWidth="4" />
  </svg>
);

const CrabItem = () => (
  <svg viewBox="0 0 100 100" className="w-[55px] h-[55px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
    <path d="M 30,50 Q 15,30 25,20 C 35,10 15,10 10,25 Q 10,40 25,55" fill="#ef4444" />
    <path d="M 70,50 Q 85,30 75,20 C 65,10 85,10 90,25 Q 90,40 75,55" fill="#ef4444" />
    <path d="M 30,65 Q 15,75 20,85" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
    <path d="M 40,68 Q 30,80 35,90" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
    <path d="M 70,65 Q 85,75 80,85" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
    <path d="M 60,68 Q 70,80 65,90" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="50" cy="55" rx="25" ry="15" fill="#dc2626" />
    <circle cx="40" cy="35" r="4" fill="#ef4444" />
    <circle cx="40" cy="35" r="2" fill="#000" />
    <circle cx="60" cy="35" r="4" fill="#ef4444" />
    <circle cx="60" cy="35" r="2" fill="#000" />
  </svg>
);

const TRASH_ICONS = [PlasticCup, PlasticBag, CanItem];

const WhaleItem = () => (
  <svg viewBox="0 0 100 100" className="w-[65px] h-[65px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
    <path d="M 85,30 Q 95,20 100,30 L 100,50 Q 80,60 70,50 Z" fill="#0284c7" />
    <path d="M 70,50 C 70,20 20,20 10,50 C 0,80 70,80 70,50 Z" fill="#0284c7" />
    <path d="M 10,55 C 30,80 60,70 65,55 Z" fill="#e0f2fe" />
    <circle cx="25" cy="45" r="3" fill="#0f172a" />
    <path d="M 40,55 Q 50,75 60,65 Z" fill="#0ea5e9" />
    <path d="M 30,25 Q 30,10 20,5 M 35,25 Q 35,5 45,5" fill="none" stroke="#bae6fd" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const JellyfishItem = () => (
  <svg viewBox="0 0 100 100" className="w-[50px] h-[50px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
    <path d="M 20,40 C 20,10 80,10 80,40 Q 80,50 50,50 Q 20,50 20,40 Z" fill="#d946ef" opacity="0.8" />
    <path d="M 30,45 C 30,20 70,20 70,45" fill="none" stroke="#fdf4ff" strokeWidth="4" opacity="0.5" />
    <path d="M 35,50 Q 30,70 40,90" fill="none" stroke="#e879f9" strokeWidth="4" strokeLinecap="round" />
    <path d="M 50,50 Q 60,70 50,90" fill="none" stroke="#e879f9" strokeWidth="4" strokeLinecap="round" />
    <path d="M 65,50 Q 70,70 60,90" fill="none" stroke="#e879f9" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const OctopusItem = () => (
  <svg viewBox="0 0 100 100" className="w-[55px] h-[55px] drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
    <ellipse cx="50" cy="35" rx="25" ry="25" fill="#ec4899" />
    <circle cx="40" cy="35" r="4" fill="#fbcfe8" />
    <circle cx="40" cy="35" r="2" fill="#0f172a" />
    <circle cx="60" cy="35" r="4" fill="#fbcfe8" />
    <circle cx="60" cy="35" r="2" fill="#0f172a" />
    <path d="M 30,50 Q 10,70 20,90" fill="none" stroke="#db2777" strokeWidth="8" strokeLinecap="round" />
    <path d="M 45,55 Q 35,75 40,95" fill="none" stroke="#db2777" strokeWidth="8" strokeLinecap="round" />
    <path d="M 55,55 Q 65,75 60,95" fill="none" stroke="#db2777" strokeWidth="8" strokeLinecap="round" />
    <path d="M 70,50 Q 90,70 80,90" fill="none" stroke="#db2777" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

const ANIMAL_ICONS = [FishItem, TurtleItem, CrabItem, WhaleItem, JellyfishItem, OctopusItem];

const FishingBoat = () => (
  <svg viewBox="0 0 180 140" className="w-[170px] h-[130px] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform -translate-y-4">
    {/* Boat translated left so it has room to hold the pole */}
    <g transform="translate(0, 0)">
      {/* Cabin & Smokestack */}
      <rect x="30" y="25" width="40" height="25" rx="5" fill="#f8fafc" />
      <rect x="35" y="30" width="12" height="12" fill="#38bdf8" />
      <rect x="52" y="30" width="12" height="12" fill="#38bdf8" />
      <path d="M 25,25 L 75,25 L 70,20 L 30,20 Z" fill="#94a3b8" />
      <rect x="80" y="20" width="10" height="30" fill="#64748b" />
      <path d="M 78,25 L 92,25 L 92,30 L 78,30 Z" fill="#f1f5f9" />
      
      {/* The Hull */}
      <path d="M 10,80 L 120,80 L 140,50 L 0,50 Z" fill="#b91c1c" />
      <path d="M 0,50 L 140,50 L 130,55 L 5,55 Z" fill="#f87171" />
      <path d="M 5,80 Q 20,90 40,80 T 80,80 T 120,80" fill="none" stroke="#cbd5e1" strokeWidth="2" opacity="0.3" />
    </g>

    {/* Bob Esponja Jellyfishing Net */}
    <g>
      {/* Stick held from inside the front of the hull */}
      <line x1="80" y1="45" x2="150" y2="85" stroke="#b45309" strokeWidth="6" strokeLinecap="round" />
      <line x1="80" y1="44" x2="150" y2="84" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />

      {/* Pink Net Bag (Trailing back towards boat) */}
      <path d="M 165,70 C 145,45 110,65 115,90 C 117,110 130,110 135,100 Z" fill="#f472b6" opacity="0.85" />
      <path d="M 165,70 C 145,45 110,65 115,90 C 117,110 130,110 135,100 Z" fill="none" stroke="#db2777" strokeWidth="2" strokeDasharray="3 3"/>
      
      {/* Metal Hoop */}
      <ellipse cx="150" cy="85" rx="6" ry="22" fill="none" stroke="#94a3b8" strokeWidth="4" transform="rotate(-45 150 85)" />
      {/* Highlight on hoop */}
      <ellipse cx="150" cy="85" rx="4" ry="20" fill="none" stroke="#e2e8f0" strokeWidth="1" transform="rotate(-45 150 85)" />
    </g>
  </svg>
);

export default function OceanoLimpoSideScroller({ onExit, onXP }: Props) {
  // A MÁGICA CONTRA O LAG ESTÁ AQUI: useMotionValue ignora o ciclo de renderização do React!
  const playerY = useMotionValue(50);
  const playerRotation = useMotionValue(0);
  const playerTop = useTransform(playerY, (y) => `${y}%`);

  const [objects, setObjects] = useState<OceanObject[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [bubbles, setBubbles] = useState<{ id: number, x: number, size: number }[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(60);
  const [lastAction, setLastAction] = useState<"hit" | "miss" | null>(null);
  const [shake, setShake] = useState(false);

  const objectsRef = useRef<OceanObject[]>([]);
  useEffect(() => {
    objectsRef.current = objects;
  }, [objects]);

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
      const speed = 0.9;
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
      const pool = isTrash ? TRASH_ICONS : ANIMAL_ICONS;
      const speedMultiplier = 1 + ((60 - timerRef.current) / 100);

      setObjects((prev) => [
        ...prev,
        {
          id: nextId.current++,
          x: 110,
          y: 10 + Math.random() * 80,
          type: (isTrash ? "trash" : "animal") as "trash" | "animal",
          iconIndex: Math.floor(Math.random() * pool.length),
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
                  {React.createElement(obj.type === 'trash' ? TRASH_ICONS[obj.iconIndex] : ANIMAL_ICONS[obj.iconIndex])}
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
                <span className="block drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] filter transition-all">
                   <FishingBoat />
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
                    <Button variant="outline" onClick={onExit} className="flex-1 border-slate-700 hover:bg-slate-800 text-black">
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