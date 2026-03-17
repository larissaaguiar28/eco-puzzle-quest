"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2, Megaphone, ChevronRight,
  Target, Zap, MapPin, Camera, Send,
  Trophy, User, ArrowUpRight, Leaf,
  Activity, Info, CheckCircle2
} from "lucide-react";
import { Link } from 'react-router-dom';

const PLAYER = {
  name: "Mariana Costa",
  rank: "Sentinela de Brotos",
  level: 12,
  xp: 2450,
  nextXp: 3000,
  nextRank: "Guardião das Copas",
  ecos: 850,
  streak: 5
};

export default function EcoNexus() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-emerald-500/30 overflow-x-hidden selection:text-white">

      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-emerald-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-6xl mx-auto p-4 md:p-10 space-y-8"
      >

        {/* --- 1. HEADER: IDENTIDADE & PROGRESSO --- */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">

            {/* Avatar com Aura de Rank */}
            <div className="relative group cursor-help">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-28 h-28 rounded-3xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 p-[3px] shadow-lg shadow-emerald-500/20"
              >
                <div className="w-full h-full rounded-[1.3rem] bg-[#020617] flex items-center justify-center overflow-hidden">
                  <User size={48} className="text-emerald-500/40" />
                </div>
              </motion.div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black text-[11px] font-black px-2.5 py-1 rounded-lg shadow-xl ring-4 ring-[#020617]">
                LVL {PLAYER.level}
              </div>
            </div>

            <div className="flex-1 space-y-6 w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">Operador Online</p>
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none drop-shadow-sm">
                    {PLAYER.rank}
                  </h2>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-md">
                  <p className="text-emerald-400 font-black text-2xl italic tracking-tighter leading-none">{PLAYER.ecos} <span className="text-[10px] text-slate-400 not-italic">EcoS</span></p>
                  <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    <Zap size={10} fill="currentColor" /> {PLAYER.streak} Dias de Streak
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Progresso de Carreira</span>
                  <span className="text-emerald-400/80">Meta: {PLAYER.nextRank}</span>
                </div>
                <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden p-[2px] border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(PLAYER.xp / PLAYER.nextXp) * 100}%` }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-cyan-400 relative"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* ARENA CARD */}
          <Link to="/home/games" className="lg:col-span-4 group relative block cursor-pointer">
            <div className="absolute inset-0 bg-emerald-500 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="h-full bg-emerald-500 hover:bg-emerald-400 transition-all duration-500 rounded-[2.5rem] p-8 flex flex-col justify-between text-[#020617] relative overflow-hidden shadow-2xl">
              <Gamepad2 size={42} strokeWidth={2.5} className="group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500" />
              <div className="space-y-1">
                <h3 className="font-black text-3xl uppercase italic tracking-tighter leading-[0.85]">Arena de<br />Desafios</h3>
                <div className="flex items-center gap-2 text-[10px] font-black bg-black/10 w-fit px-2 py-0.5 rounded-md">
                  <Activity size={12} /> COMPETITIVO ATIVO
                </div>
              </div>
              <ArrowUpRight className="absolute top-8 right-8 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              <div className="absolute -bottom-10 -right-6 text-black/5 rotate-12 group-hover:scale-110 transition-transform duration-700">
                <Gamepad2 size={200} />
              </div>
            </div>
          </Link>
        </header>

        {/* --- 2. EVENTO: MISSION OVERLAY --- */}
        <Link to="/home/feed" className="lg:col-span-4 group relative block cursor-pointer">
          <section className="group relative overflow-hidden rounded-[3rem] p-[1px] bg-gradient-to-b from-white/10 to-transparent">
            <div className="bg-[#0f172a] rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent)]" />

              <div className="flex-1 space-y-8 relative z-10">
                <div className="inline-flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-2xl">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="text-blue-400 text-[11px] font-black uppercase tracking-[0.2em]">Missão de Temporada</span>
                </div>

                <h2 className="text-5xl md:text-7xl font-black text-white italic leading-[0.85] tracking-tighter uppercase">
                  OPERAÇÃO <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">CÉU<br />LIMPO</span>
                </h2>

                <p className="text-slate-400 font-medium max-w-lg text-lg leading-relaxed">
                  Nesta temporada, cada foco de poluição reportado gera <span className="text-white font-bold italic underline decoration-emerald-500/50 decoration-4 underline-offset-4">2x XP</span>. O horizonte depende de você.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-[#020617] font-black px-8 py-5 rounded-2xl hover:bg-emerald-400 transition-all uppercase italic tracking-tighter flex items-center gap-3 group/btn shadow-xl shadow-white/5">
                    Engajar Agora <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-white/5 border border-white/10 text-white font-black px-8 py-5 rounded-2xl hover:bg-white/10 transition-all uppercase italic tracking-tighter flex items-center gap-3">
                    Briefing <Info size={20} />
                  </button>
                </div>
              </div>

              <div className="hidden lg:flex w-1/3 justify-center items-center relative">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="relative"
                >
                  <Trophy size={180} className="text-emerald-500/10" />
                  <Target size={100} className="absolute inset-0 m-auto text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.6)]" />
                </motion.div>
              </div>
            </div>
          </section>
        </Link>

        {/* --- 3. PATRULHA & TASKS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* PAINEL DE DENÚNCIA */}
          <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Patrulha Ativa</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <MapPin size={12} className="text-rose-500" /> Sincronização GPS: Estável
                </p>
              </div>
              <div className="p-4 bg-rose-500/10 rounded-3xl border border-rose-500/20">
                <Megaphone className="text-rose-500" size={32} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ReportAction icon={MapPin} label="Localização" />
              <ReportAction icon={Camera} label="Evidência" />
              <ReportAction icon={Send} label="Emitir Alerta" highlight />
            </div>

            <Leaf className="absolute -bottom-16 -left-16 w-64 h-64 text-emerald-500/[0.03] -rotate-12 pointer-events-none" />
          </div>

          {/* QUADRO DE MISSÕES (DAILIES) */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-white uppercase italic tracking-tighter text-xl text-emerald-500">Dailies</h3>
              <div className="bg-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                Refresh em 12h
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <MissionItem label="Validar 3 Denúncias" xp="+150" done={true} />
              <MissionItem label="Eco Quiz Semanal" xp="+300" done={false} />
              <MissionItem label="Coleta Seletiva (Foto)" xp="+80" done={false} />
              <MissionItem label="Convide um Amigo" xp="+500" done={false} />
            </div>

            <button className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-400 transition-all group">
              Acessar Log de Missões
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

// --- SUB-COMPONENTES REFINADOS ---

function ReportAction({ icon: Icon, label, highlight }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative flex flex-col items-center justify-center p-8 rounded-[2rem] transition-all gap-4 border overflow-hidden group
        ${highlight
          ? "bg-emerald-500 text-[#020617] border-emerald-400 shadow-xl shadow-emerald-500/20"
          : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white"}
      `}
    >
      <Icon size={28} strokeWidth={highlight ? 3 : 2} className="relative z-10" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] relative z-10 leading-none">{label}</span>

      {highlight && (
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
        />
      )}
    </motion.button>
  );
}

function MissionItem({ label, xp, done }: any) {
  return (
    <div className={`
      group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300
      ${done ? "bg-emerald-500/5 border-emerald-500/20 opacity-60" : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.07]"}
    `}>
      <div className="flex items-center gap-4">
        <div className={`
          flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-colors
          ${done ? "bg-emerald-500 border-emerald-500" : "border-slate-700 bg-slate-800/50"}
        `}>
          {done && <CheckCircle2 size={14} className="text-[#020617]" />}
        </div>
        <span className={`text-sm font-bold tracking-tight transition-all ${done ? "text-emerald-500 line-through" : "text-slate-200"}`}>
          {label}
        </span>
      </div>
      <span className={`text-[10px] font-black italic uppercase ${done ? "text-emerald-500" : "text-slate-500"}`}>
        {xp} XP
      </span>
    </div>
  );
}