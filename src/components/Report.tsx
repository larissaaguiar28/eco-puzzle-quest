import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Megaphone,Leaf,Camera,Send, Type} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../../utils/supabase";

export type Report = {
    name?: string,
    url?: string,
    message?: string,
    address?: string
};

export  function Report(){
    const {user, signOutUser} = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [report, setReport] = useState<Report>();


    async function handleReport():Promise<void> {
      let data={...report,user_id:user.id}
      console.log (data)

      const {error}= await supabase.from("reports").insert(data);

      if (error){
        alert(error.message)
        return
      }
      
      alert("recebemos sua denúcia")
    }

    return (
        <>
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
               <ReportAction icon={Send} label="Emitir Alerta" onClick={()=> handleReport()}  highlight />
               <input placeholder="descreva sua denúncia" onChange={(e)=>setReport({...report, message:e.target.value})}/>
            </div>
            
            <Leaf className="absolute -bottom-16 -left-16 w-64 h-64 text-emerald-500/[0.03] -rotate-12 pointer-events-none" />
          </div>
        </>
    )
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
  )
};