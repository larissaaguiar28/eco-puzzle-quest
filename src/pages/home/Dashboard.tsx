import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Trophy, Star, Users, MessageSquare, 
  Zap, PlayCircle, HelpCircle, ArrowRight,
  Leaf, Award, Flame, Wallet, Coins, 
  Gamepad2, RefreshCw, Plus, LayoutDashboard, 
  BotMessageSquare, Gift, ChevronRight, Lock,
  AlertTriangle, Megaphone // Adicionados ícones de denúncia
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#FDFEFF] p-4 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* --- 1. CENTRO DE EVOLUÇÃO --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-8 border-none shadow-2xl shadow-emerald-100/50 bg-white rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-0 flex flex-col md:flex-row">
              {/* Lado Esquerdo: Status */}
              <div className="p-8 md:w-2/5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex flex-col justify-between">
                <div className="space-y-4">
                  <Badge className="bg-white/20 hover:bg-white/30 border-none text-white font-bold">Status do Perfil</Badge>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl">
                      <Star size={32} fill="white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black tracking-tighter">Nível 14</h2>
                      <p className="text-emerald-100 font-bold text-xs uppercase tracking-widest text-shadow-sm">Guardião Elite</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase opacity-80 tracking-widest">
                    <span>Pontos Totais</span>
                    <span>12.450 XP</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
                    <Flame size={16} className="text-orange-400" fill="currentColor" />
                    <span className="text-sm font-bold italic tracking-tight">12 dias de ofensiva!</span>
                  </div>
                </div>
              </div>

              {/* Lado Direito: Progresso */}
              <div className="p-8 flex-1 space-y-8 bg-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Próximo Nível</p>
                      <h3 className="text-xl font-black text-slate-800 italic">Mestre da Biosfera</h3>
                    </div>
                    <span className="text-emerald-600 font-black text-sm">Faltam 150 XP</span>
                  </div>
                  <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.4)] rounded-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seu Saldo</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <Coins size={20} className="text-amber-500 shadow-sm" />
                      <span className="text-2xl font-black text-slate-800">85</span>
                    </div>
                  </div>
                  <Link to="/achievements" className="group">
                    <div className="h-full bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center hover:bg-emerald-100 transition-all cursor-pointer shadow-sm group-hover:shadow-md">
                      <Award size={24} className="text-emerald-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] font-black text-emerald-700 uppercase">Ver Conquistas</p>
                    </div>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --- RECARGA RÁPIDA (COM DENÚNCIA) --- */}
          <div className="lg:col-span-4 space-y-4">
            <ReloadOption 
                icon={Gamepad2} 
                label="Jogar Desafios" 
                reward="+20 EcoS" 
                to="/home/games" 
                color="text-sky-600" 
                bg="bg-sky-50" 
            />
            {/* NOVO CAMPO: FAÇA SUA DENÚNCIA */}
            <ReloadOption 
                icon={Megaphone} 
                label="Fazer Denúncia" 
                reward="+30 EcoS" 
                to="/home/report" 
                color="text-rose-600" 
                bg="bg-rose-50" 
                isUrgent={true}
            />
            <button className="flex items-center justify-center gap-3 w-full p-5 bg-slate-900 hover:bg-black text-white rounded-[1.8rem] font-bold transition-all shadow-xl text-lg group">
              <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" /> Trocar XP p/ Saldo
            </button>
          </div>
        </section>

        {/* --- 2. COMUNIDADE ECOS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <main className="lg:col-span-8 space-y-6">
            
            <section className="bg-[#f8fafc] border-2 border-slate-100 p-8 rounded-[2.5rem] space-y-8 shadow-inner relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-6 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 text-slate-900 uppercase italic">
                    <MessageSquare className="text-emerald-500" size={26} /> Comunidade EcoS
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Feed Global de Atividade</p>
                </div>
                <Link to="/home/feed">
                  <Button size="lg" className="rounded-2xl font-bold px-8 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200 border-b-4 border-emerald-800 active:border-b-0 transition-all">
                    Postar <Coins size={16} className="ml-2 text-amber-300" /> 10
                  </Button>
                </Link>
              </div>

              <motion.div whileHover={{ y: -5 }}>
                <Card className="border-none shadow-xl shadow-slate-200/50 bg-white group rounded-[2rem] overflow-hidden">
                  <div className="h-2 w-full bg-emerald-500" />
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-full bg-slate-200 border-2 border-white shadow-md bg-gradient-to-tr from-slate-200 to-slate-100" />
                      <div>
                        <p className="font-black text-base text-slate-950">Mariana Costa</p>
                        <p className="text-[10px] text-emerald-600 font-black uppercase bg-emerald-50 px-2 py-0.5 rounded tracking-tighter">#HortaCaseira • Guia</p>
                      </div>
                    </div>
                    <h4 className="font-extrabold text-xl mb-3 text-slate-950 group-hover:text-emerald-600 transition-colors tracking-tight">Minha primeira colheita de tomates orgânicos! 🍅</h4>
                    <p className="text-base text-slate-600 leading-relaxed font-medium bg-slate-50/40 p-4 rounded-2xl">"Depois de 3 meses cuidando e usando apenas adubo de compostagem caseira, finalmente colhi! O sabor é incomparável."</p>
                  </CardContent>
                </Card>
              </motion.div>
            </section>

            {/* Banner Desafio */}
            <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-200 group">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-4 text-center md:text-left">
                  <Badge className="bg-white/20 text-white border-none font-bold px-4 py-1">MISSÃO DA SEMANA</Badge>
                  <h4 className="text-3xl font-black leading-none">Poste sua Ecobag favorita</h4>
                  <p className="text-blue-100 font-medium italic opacity-90">Ganhe reembolso e inspire novos membros.</p>
                </div>
                <Link to={"/home/feed"}>
                  <Button className="bg-white text-blue-700 hover:bg-blue-50 font-black px-12 h-16 rounded-2xl shadow-xl text-lg group-hover:scale-105 transition-transform">Aceitar +20 EcoS</Button>
                </Link>
              </div>
              <Gift className="absolute -bottom-10 -right-10 h-60 w-60 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>
          </main>

          {/* --- SIDEBAR: CONQUISTAS & CHAT --- */}
          <aside className="lg:col-span-4 space-y-8">
            
            <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center border-b pb-4">Suas Conquistas</h3>
              <div className="grid grid-cols-3 gap-3">
                <BadgeItem icon={Leaf} active={true} label="Plantador" />
                <BadgeItem icon={Zap} active={true} label="Energia" />
                <BadgeItem icon={Lock} active={false} label="???" />
              </div>
              <Button variant="ghost" className="w-full text-emerald-600 font-black text-[10px] hover:bg-emerald-50 rounded-xl tracking-widest uppercase">Ver todas (24) <ChevronRight size={14} className="ml-1"/></Button>
            </div>

            <Link to={"/home/chatbot"}>
              <button  className="w-full bg-gradient-to-br from-violet-600 to-indigo-700 p-8 rounded-[2.5rem] text-left text-white shadow-2xl shadow-indigo-200 group transition-all hover:scale-[1.02] relative overflow-hidden">
                <div className="bg-white/20 w-fit p-4 rounded-3xl mb-6 shadow-inner relative z-10">
                  <BotMessageSquare size={36} />
                </div>
                <h4 className="text-2xl font-black mb-2 flex items-center gap-2 relative z-10 tracking-tighter italic" >EcoChat <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" /></h4>
                <p className="text-indigo-100 text-sm font-medium opacity-80 relative z-10">Dúvidas sobre descarte? Pergunte agora.</p>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
              </button>
            </Link>

            <Card className="bg-amber-50 border-2 border-amber-100 rounded-[2.5rem] shadow-none">
              <CardContent className="p-8 space-y-4">
                <div className="bg-amber-100 w-fit p-3 rounded-2xl text-amber-600 shadow-sm">
                  <Zap size={24} fill="currentColor" />
                </div>
                <p className="text-sm text-amber-900 font-bold leading-relaxed italic">
                  "Desligar aparelhos em stand-by economiza até 12% na sua conta de luz."
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

// --- Componentes Auxiliares ---

function ReloadOption({ icon: Icon, label, reward, to, color, bg, isUrgent }: any) {
  return (
    <Link to={to} className="block group">
      <div className={`flex items-center justify-between p-5 bg-white border ${isUrgent ? 'border-rose-100' : 'border-slate-100'} rounded-[1.8rem] hover:border-emerald-200 hover:shadow-xl transition-all`}>
        <div className="flex items-center gap-4">
          <div className={`${bg} ${color} p-3.5 rounded-2xl group-hover:scale-110 transition-transform shadow-inner`}>
            <Icon size={20} strokeWidth={3}/>
          </div>
          <span className={`text-sm font-black tracking-tight ${isUrgent ? 'text-rose-900' : 'text-slate-700'}`}>{label}</span>
        </div>
        <span className={`text-[10px] font-black ${isUrgent ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'} px-3 py-1.5 rounded-lg border`}>{reward}</span>
      </div>
    </Link>
  );
}

function BadgeItem({ icon: Icon, active, label }: any) {
  return (
    <div className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${active ? 'bg-white border-slate-100 shadow-sm hover:scale-105' : 'bg-slate-50 border-slate-50 opacity-30'}`}>
      <div className={`${active ? 'text-emerald-500' : 'text-slate-300'}`}>
        <Icon size={24} strokeWidth={active ? 3 : 1} />
      </div>
      <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">{label}</span>
    </div>
  );
}