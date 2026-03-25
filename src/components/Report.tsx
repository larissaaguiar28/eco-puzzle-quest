import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Megaphone, Leaf, Camera, Send, Type } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../../utils/supabase";
import { rejects } from "assert";


export type Report = {
  name?: string,
  url?: string,
  message?: string,
  address?: string
};

export function Report() {
  const { user, signOutUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [report, setReport] = useState<Report>();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  async function handleReport(): Promise<void> {
    if (!report?.message || report.message.trim() === "") {
      alert("Escreva sua denúncia antes de enviar!");
      return;
    }

    // CORREÇÃO 2: Criamos um objeto final para garantir que o user_id e os dados atuais sejam enviados
    // O estado do React pode demorar para atualizar, então montamos o payload aqui
    const reportData = { 
      message: report.message,
      address: report.address,
      url: report.url, // A URL vinda do handlEvidence
      user_id: user?.id 
    };

    const { error } = await supabase.from("reports").insert([reportData])

    if (error) {
      alert(error.message)
      return
    }

    alert("recebemos sua denúcia")
    // Limpar o campo após enviar
    setReport({ message: "", name: "", address: "", url: "" });
  }

  async function handleLocation(): Promise<void> {
    if (!navigator.geolocation) {
      alert("Seu navegador não suporta geolocalização!")
      return;
    }

    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
      });
    });

    const { latitude, longitude } = position.coords;
    const locationString = `${latitude}, ${longitude}`;

    const data = {
      ...report,
      user_id: user.id,
      address: locationString, // Enviando as duas coordenadas em uma única coluna
    };

    setReport(data)
    alert("Localização autenticada!")

  };

  async function handlEvidence(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
  const file = event.target.files?.[0];
  if (!file) return;

  // IMPORTANTE: O erro costuma estar aqui na captura da URL
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `denuncias/${fileName}`;

  // Faz o upload
  const { error: uploadError } = await supabase.storage
    .from('images') // O nome do bucket tem que ser igual ao do painel
    .upload(filePath, file);

  if (uploadError) {
    console.error(uploadError); // Veja o erro no F12 se não subir
    return;
  }

  // MUDANÇA ESSENCIAL AQUI:
  const { data } = supabase.storage.from('images').getPublicUrl(filePath);
  
  // Você precisa atualizar o estado com a URL pública para o handleReport "enxergar" ela depois
  setReport((prev) => ({ ...prev, url: data.publicUrl }));
}


  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlEvidence}
        className="hidden"
        accept="image/*"
      />


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
          <ReportAction icon={MapPin} label="Localização" onClick={() => handleLocation()} highlight />
          <ReportAction icon={Camera} label="Evidência" onClick={(e) => fileInputRef.current.click()} highlight />
          <ReportAction icon={Send} label="Emitir Alerta" onClick={() => handleReport()} highlight />
          <input value={report?.message || ""} placeholder="descreva sua denúncia" onChange={(e) => setReport({ ...report, message: e.target.value })}
            className="sm:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all mt-2"
          />


        </div>

        <Leaf className="absolute -bottom-16 -left-16 w-64 h-64 text-emerald-500/[0.03] -rotate-12 pointer-events-none" />
      </div>
    </>
  )
}

// --- SUB-COMPONENTES REFINADOS ---

function ReportAction({ icon: Icon, label, highlight, onClick }: any) {
  return (
    <motion.button
      onClick={onClick}
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