"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Trophy, Star, Users, MessageSquare, 
  Zap, PlayCircle, HelpCircle, ArrowRight,
  Leaf, Award, Flame, Wallet, Coins, 
  Gamepad2, RefreshCw, Plus, LayoutDashboard, 
  BotMessageSquare, Gift, ChevronRight, Lock,
  AlertTriangle, Megaphone, Sparkles, TrendingUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Animações
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f0f4f8] bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-blue-50 p-4 md:p-10 font-sans text-slate-900 overflow-x-hidden">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-10"
      >
        
        {/* --- 1. HEADER & STATUS DE EVOLUÇÃO --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-8">
            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white rounded-[3rem] overflow-hidden group">
              <CardContent className="p-0 flex flex-col md:flex-row min-h-[320px]">
                
                {/* Lado Esquerdo: Dashboard Gamer Style */}
                <div className="p-10 md:w-2/5 bg-slate-900 relative text-white flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[80px] -mr-32 -mt-32 rounded-full" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Sistema Online</span>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(16,185,129,0.5)] rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <Star size={40} fill="white" className="text-white" />
                      </div>
                      <div>
                        <h2 className="text-4xl font-black tracking-tighter leading-none">Nível 14</h2>
                        <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mt-1">Guardião Elite</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-12 space-y-3">
                    <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shadow-2xl">
                      <Flame size={18} className="text-orange-500 animate-bounce" fill="currentColor" />
                      <span className="text-sm font-black italic tracking-tight">12 dias de ofensiva!</span>
                    </div>
                  </div>
                </div>

                {/* Lado Direito: Progressão Detalhada */}
                <div className="p-10 flex-1 space-y-8 bg-white relative">
                  <div className="space-y-5">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Próxima Patente</p>
                        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2 italic">
                          Mestre da Biosfera <Sparkles size={18} className="text-amber-400" />
                        </h3>
                      </div>
                      <span className="text-emerald-600 font-black text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 italic">Faltam 150 XP</span>
                    </div>

                    <div className="relative h-6 w-full bg-slate-100 rounded-2xl overflow-hidden p-1 shadow-inner border border-slate-50">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 rounded-xl relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="group bg-slate-50 p-5 rounded-[2rem] border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Atual</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="bg-amber-100 p-2 rounded-lg">
                          <Coins size={22} className="text-amber-500" />
                        </div>
                        <span className="text-3xl font-black text-slate-800">850</span>
                      </div>
                    </div>
                    <Link to="/achievements" className="group">
                      <div className="h-full bg-emerald-50 p-5 rounded-[2rem] border border-emerald-100 transition-all hover:bg-emerald-500 group-hover:text-white flex flex-col items-center justify-center text-center shadow-sm">
                        <Award size={28} className="text-emerald-600 group-hover:text-white mb-2 transition-transform group-hover:scale-110" />
                        <p className="text-[10px] font-black uppercase tracking-tighter">Conquistas</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* --- AÇÕES LATERAIS --- */}
          <motion.div variants={itemVariants} className="lg:col-span-4 space-y-4">
            <ReloadOption 
              icon={Gamepad2} 
              label="Jogar Desafios" 
              reward="+20 EcoS" 
              to="/home/games" 
              color="text-sky-600" 
              bg="bg-sky-50" 
            />
            <ReloadOption 
              icon={Megaphone} 
              label="Fazer Denúncia" 
              reward="+30 EcoS" 
              to="/home/report" 
              color="text-rose-600" 
              bg="bg-rose-50" 
              isUrgent={true}
            />
            <button className="relative overflow-hidden flex items-center justify-center gap-3 w-full h-20 bg-gradient-to-r from-slate-900 to-slate-800 hover:to-black text-white rounded-[2rem] font-black transition-all shadow-2xl group border-b-4 border-slate-950 active:border-b-0 active:translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
              <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-1000 text-emerald-400" /> 
              TROCAR XP POR SALDO
            </button>
          </motion.div>
        </section>

        {/* --- 2. CONTEÚDO PRINCIPAL --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <motion.main variants={itemVariants} className="lg:col-span-8 space-y-8">
            <section className="bg-white/40 border-2 border-white p-2 rounded-[3rem] shadow-2xl backdrop-blur-xl">
              <div className="bg-white p-8 rounded-[2.5rem] space-y-8">
                <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black flex items-center gap-3 text-slate-900 italic uppercase tracking-tighter">
                      <TrendingUp className="text-emerald-500" size={28} /> Comunidade EcoS
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">O que está acontecendo agora</p>
                  </div>
                  <Button size="lg" className="rounded-2xl font-black px-8 bg-emerald-600 hover:bg-emerald-700 shadow-[0_15px_30px_-10px_rgba(16,185,129,0.4)] border-b-4 border-emerald-900 active:border-b-0 transition-all transform hover:-translate-y-1">
                    NOVO POST <Plus size={18} className="ml-2" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <PostCard 
                    author="Mariana Costa" 
                    tag="#HortaCaseira" 
                    title="Minha primeira colheita de tomates! 🍅"
                    content="Depois de 3 meses cuidando e usando apenas adubo de compostagem caseira, finalmente colhi! O sabor é incomparável."
                  />
                </div>
              </div>
            </section>

            {/* Banner Desafio Estilizado */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-blue-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-200 group border-b-8 border-blue-800"
            >
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="space-y-5 text-center md:text-left">
                  <Badge className="bg-amber-400 text-blue-900 border-none font-black px-5 py-1.5 rounded-full text-xs">EVENTO ATIVO</Badge>
                  <h4 className="text-4xl font-black leading-tight tracking-tighter">DESAFIO ECOBAG:<br/>ESTILO E CONSCIÊNCIA</h4>
                  <p className="text-blue-100 font-medium text-lg opacity-80">Poste sua Ecobag favorita e ganhe bônus em dobro hoje.</p>
                </div>
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-black px-12 h-20 rounded-3xl shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] text-xl transition-all hover:scale-105 active:scale-95">
                  ACEITAR +20 EcoS
                </Button>
              </div>
              <Gift className="absolute -bottom-10 -right-10 h-72 w-72 text-white/10 -rotate-12 group-hover:rotate-0 transition-all duration-1000" />
            </motion.div>
          </motion.main>

          {/* --- SIDEBAR --- */}
          <motion.aside variants={itemVariants} className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 space-y-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] text-center">🏆 Ranking de Conquistas</h3>
              <div className="grid grid-cols-3 gap-4">
                <BadgeItem icon={Leaf} active={true} label="Nature" />
                <BadgeItem icon={Zap} active={true} label="Power" />
                <BadgeItem icon={Lock} active={false} label="???" />
              </div>
              <Button variant="outline" className="w-full h-14 border-2 border-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-50 hover:text-emerald-600 transition-all group">
                VER TODAS (24) <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <Link to="/home/chatbot" className="block">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-violet-600 via-indigo-700 to-blue-800 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group border-b-8 border-indigo-950"
              >
                <div className="bg-white/10 w-fit p-5 rounded-[2rem] mb-8 backdrop-blur-xl shadow-2xl border border-white/20 group-hover:rotate-12 transition-transform">
                  <BotMessageSquare size={42} />
                </div>
                <h4 className="text-3xl font-black mb-2 flex items-center gap-3 italic tracking-tighter">EcoChat <ArrowRight className="group-hover:translate-x-2 transition-transform" /></h4>
                <p className="text-indigo-100/80 font-bold">Assistência por IA 24/7</p>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[60px] rounded-full" />
              </motion.div>
            </Link>

            <div className="bg-amber-100/50 p-8 rounded-[3rem] border-2 border-amber-200/50 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
              <div className="bg-amber-400 w-fit p-3 rounded-2xl text-white shadow-lg mb-4 group-hover:scale-110 transition-transform">
                <Zap size={24} fill="currentColor" />
              </div>
              <p className="text-amber-900 font-black text-lg leading-tight italic">
                "Desligar aparelhos em stand-by economiza até 12% na sua conta de luz."
              </p>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </div>
  );
}

// --- SUBCOMPONENTES ---

function ReloadOption({ icon: Icon, label, reward, color, bg, isUrgent }: any) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <button className={cn(
        "flex items-center justify-between w-full p-6 bg-white rounded-[2.2rem] transition-all shadow-lg border-2",
        isUrgent ? "border-rose-100 hover:border-rose-400 animate-pulse-subtle" : "border-transparent hover:border-emerald-300"
      )}>
        <div className="flex items-center gap-5">
          <div className={cn(bg, color, "p-4 rounded-2xl shadow-inner")}>
            <Icon size={24} strokeWidth={3}/>
          </div>
          <span className={cn("text-lg font-black tracking-tighter", isUrgent ? "text-rose-600" : "text-slate-800")}>{label}</span>
        </div>
        <Badge className={cn("h-10 px-4 rounded-xl font-black text-xs border-none", isUrgent ? "bg-rose-500 text-white" : "bg-emerald-100 text-emerald-700")}>
          {reward}
        </Badge>
      </button>
    </motion.div>
  );
}

function PostCard({ author, tag, title, content }: any) {
  return (
    <motion.div whileHover={{ y: -5 }}>
      <Card className="border-none shadow-xl bg-slate-50/50 hover:bg-white transition-all rounded-[2.5rem] overflow-hidden group border-2 border-transparent hover:border-emerald-100">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 border-2 border-white shadow-lg" />
            <div>
              <p className="font-black text-lg text-slate-900">{author}</p>
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none font-black text-[10px] uppercase">{tag}</Badge>
            </div>
          </div>
          <h4 className="font-black text-2xl mb-4 text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">{title}</h4>
          <p className="text-slate-600 leading-relaxed font-medium text-lg">{content}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function BadgeItem({ icon: Icon, active, label }: any) {
  return (
    <div className={cn(
      "flex flex-col items-center gap-3 p-5 rounded-[2rem] border transition-all duration-500",
      active ? "bg-white border-slate-100 shadow-xl scale-110" : "bg-slate-50 border-transparent opacity-40"
    )}>
      <div className={cn(active ? "text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "text-slate-400")}>
        <Icon size={32} strokeWidth={active ? 2.5 : 1} />
      </div>
      <span className="text-[10px] font-black uppercase text-slate-500">{label}</span>
    </div>
  );
}