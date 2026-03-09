"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Gamepad2, Megaphone, Calendar, ChevronRight, 
  Target, Zap, ShieldCheck, TreePine, 
  MapPin, Camera, Send, Sparkles, Trophy,
  User, ArrowUpRight, Leaf, Activity
} from "lucide-react";

// --- DADOS DO JOGADOR ---
const PLAYER = {
  name: "Mariana Costa",
  rank: "Sentinela de Brotos",
  level: 12,
  xp: 2450,
  nextXp: 3000,
  nextRank: "Guardião das Copas",
  ecos: 850
};

export default function EcoNexus() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* GRADIENTES DE FUNDO (Sutis para profundidade) */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/10 blur-[140px] rounded-full -z-10" />
      <div className="fixed bottom-0 right-0 w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full -z-10" />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 max-w-6xl mx-auto p-6 md:p-10 space-y-8"
      >
        
        {/* --- 1. HEADER: IDENTIDADE & PROGRESSO --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#1E293B]/50 backdrop-blur-xl border border-white/5 p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row gap-8 items-center">
            
            {/* Perfil Cinético */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-600 p-[2px] rotate-3 group-hover:rotate-6 transition-transform">
                <div className="w-full h-full rounded-[1.4rem] bg-[#0F172A] flex items-center justify-center">
                  <User size={40} className="text-emerald-500/50" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-[#0F172A] text-[10px] font-black px-2 py-1 rounded-lg shadow-lg uppercase tracking-tighter">
                LVL {PLAYER.level}
              </div>
            </div>

            {/* Progresso & Status */}
            <div className="flex-1 space-y-5 w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">
                    {PLAYER.rank}
                  </h2>
                  <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                    <Activity size={12} /> Status: Ativo em Campo
                  </p>
                </div>
                <div className="text-right">
                   <p className="text-white font-black text-xl italic tracking-tighter">{PLAYER.ecos} EcoS</p>
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Saldo Disponível</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">XP: {PLAYER.xp} / {PLAYER.nextXp}</span>
                  <span className="text-emerald-400 italic">Próximo: {PLAYER.nextRank}</span>
                </div>
                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(PLAYER.xp / PLAYER.nextXp) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ACESSO RÁPIDO: JOGOS */}
          <Link to="/home/games" className="lg:col-span-4 group h-full">
            <div className="h-full bg-emerald-500 hover:bg-emerald-400 transition-all duration-300 rounded-[3rem] p-8 flex flex-col justify-between text-[#0F172A] relative overflow-hidden shadow-xl shadow-emerald-900/20">
              <Gamepad2 size={40} strokeWidth={2.5} className="relative z-10" />
              <div className="relative z-10">
                <h3 className="font-black text-2xl uppercase italic tracking-tighter leading-none">Arena de<br/>Desafios</h3>
                <p className="mt-1 text-xs font-bold opacity-70">RANKING GLOBAL DISPONÍVEL</p>
              </div>
              <ArrowUpRight className="absolute top-8 right-8 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              <div className="absolute -bottom-6 -right-6 text-[#0F172A]/10 rotate-12">
                 <Gamepad2 size={150} />
              </div>
            </div>
          </Link>
        </section>

        {/* --- 2. EVENTO: DESIGN "MISSION OVERLAY" --- */}
        <section className="relative overflow-hidden rounded-[3.5rem] bg-[#1E293B]/30 border border-white/5 p-2">
          <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 relative">
            
            <div className="flex-1 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Evento: Missão Global</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-white italic leading-[0.9] tracking-tighter uppercase">
                OPERAÇÃO <span className="text-emerald-400">CÉU<br/>LIMPO</span>
              </h2>
              
              <p className="text-slate-400 font-medium max-w-lg text-lg leading-relaxed">
                Nesta temporada, cada denúncia de foco de poluição gera <span className="text-white font-bold italic">2x XP</span>. Ajude-nos a limpar o horizonte.
              </p>

              <button className="bg-white text-[#0F172A] font-black px-10 py-5 rounded-2xl hover:bg-emerald-400 transition-all uppercase italic tracking-tighter flex items-center gap-3">
                Aceitar Desafio <ChevronRight size={20} />
              </button>
            </div>

            <div className="hidden lg:flex w-1/3 justify-center items-center relative">
               <div className="w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl absolute" />
               <Trophy size={160} className="text-emerald-500/20 rotate-[-10deg]" />
               <Target size={80} className="absolute text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]" />
            </div>
          </div>
        </section>

        {/* --- 3. PATRULHA & TASKS --- */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PAINEL DE DENÚNCIA (PATRULHA) */}
          <div className="lg:col-span-2 bg-[#1E293B]/50 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Patrulha Ambiental</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 italic opacity-70">A mudança começa com o seu registro.</p>
              </div>
              <Megaphone className="text-rose-500/50 group-hover:text-rose-500 group-hover:rotate-12 transition-all duration-500" size={40} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
               <ReportAction icon={MapPin} label="Local" />
               <ReportAction icon={Camera} label="Evidência" />
               <ReportAction icon={Send} label="Emitir Alerta" highlight />
            </div>
            
            <Leaf className="absolute -bottom-10 -right-10 w-48 h-48 text-white/[0.02] -rotate-12" />
          </div>

          {/* QUADRO DE MISSÕES */}
          <div className="bg-[#1E293B]/50 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-white uppercase italic tracking-tighter">Dailies</h3>
                <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500">
                  <Zap size={18} fill="currentColor" />
                </div>
              </div>
              
              <div className="space-y-3">
                <MissionItem label="Validar 3 Denúncias" xp="+150" done={true} />
                <MissionItem label="Eco Quiz Semanal" xp="+300" done={false} />
                <MissionItem label="Reduzir Plástico" xp="+80" done={false} />
              </div>
            </div>

            <button className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-all">
              Ver Todas as Quests
            </button>
          </div>

        </section>

      </motion.div>
    </div>
  );
}

// --- MICRO-COMPONENTES ---

function ReportAction({ icon: Icon, label, highlight }: any) {
  return (
    <button className={`
      flex flex-col items-center justify-center p-7 rounded-[2.5rem] transition-all gap-3 border
      ${highlight 
        ? "bg-emerald-600 text-[#0F172A] border-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-900/20" 
        : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/10 hover:text-white"}
    `}>
      <Icon size={24} strokeWidth={2.5} />
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

function MissionItem({ label, xp, done }: any) {
  return (
    <div className={`
      flex items-center justify-between p-4 rounded-2xl border transition-all
      ${done ? "bg-emerald-500/5 border-emerald-500/10 opacity-40" : "bg-white/5 border-white/5"}
    `}>
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-1.5 rounded-full ${done ? "bg-emerald-500" : "bg-slate-600"}`} />
        <span className={`text-sm font-bold tracking-tight ${done ? "text-emerald-500 line-through" : "text-slate-300"}`}>
          {label}
        </span>
      </div>
      <span className="text-[10px] font-black text-slate-500 italic uppercase">{xp}</span>
    </div>
  );
}