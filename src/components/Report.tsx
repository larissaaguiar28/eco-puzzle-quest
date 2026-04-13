import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Megaphone, Leaf, Camera, Send, Type } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase";
import { useToast } from "@/hooks/use-toast";

export type Report = {
  name?: string,
  url?: string,
  message?: string,
  address?: string
};

export function Report() {
  const { toast } = useToast();
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [report, setReport] = useState<Report>();
  const [uploading, setUploading] = useState(false);
  const [ecoBalance, setEcoBalance] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadBalance() {
      if (!user?.id) return;
      const { data } = await supabase.from('profiles').select('eco').eq('user_id', user.id).single();
      if (data) setEcoBalance(data.eco || 0);
    }
    loadBalance();
  }, [user]);


  async function handleReport(): Promise<void> {
    if (!report?.message || report.message.trim() === "") {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Escreva sua denúncia antes de enviar!"
      });
      return;
    }

    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Usuário não autenticado."
      });
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('eco')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profileData || profileData.eco < 80) {
      toast({
        variant: "destructive",
        title: "Saldo Insuficiente",
        description: "Você não possui EcoS suficientes (80) para enviar uma denúncia."
      });
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ eco: profileData.eco - 80 })
      .eq('user_id', user.id);

    if (updateError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível deduzir EcoS no momento."
      });
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
      console.error("Erro ao enviar denúncia:", error);
      toast({
        variant: "destructive",
        title: "Erro no Envio",
        description: "Não foi possível enviar sua denúncia no momento."
      });
      return
    }

    toast({
      title: "Sucesso",
      description: "Recebemos sua denúcia"
    });
    // Limpar o campo após enviar
    setReport({ message: "", name: "", address: "", url: "" });
    // Redirecionar para a página de denúncias
    navigate("/home/report");
  }

  async function handleLocation(): Promise<void> {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Seu navegador não suporta geolocalização!"
      });
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
    toast({
      title: "Sucesso",
      description: "Localização autenticada!"
    });

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
          <div className="flex gap-4 items-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 backdrop-blur-md hidden sm:flex items-center">
              <p className="text-emerald-400 font-black text-xl italic tracking-tighter leading-none">{ecoBalance} <span className="text-[10px] text-slate-400 not-italic">EcoS</span></p>
            </div>
            <div className="p-4 bg-rose-500/10 rounded-3xl border border-rose-500/20">
              <Megaphone className="text-rose-500" size={32} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ReportAction icon={MapPin} label="Localização" onClick={() => handleLocation()} highlight />
          <ReportAction icon={Camera} label="Evidência" onClick={(e) => fileInputRef.current.click()} highlight />
          <ReportAction icon={Send} label="Emitir Alerta" onClick={() => handleReport()} highlight cost="-80 EcoS" />
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

function ReportAction({ icon: Icon, label, highlight, cost, onClick }: any) {
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
      <Icon size={32} strokeWidth={highlight ? 3 : 2} className="relative z-10" />
      <div className="flex flex-col items-center relative z-10 gap-2 mt-2">
        <span className="text-xs font-black uppercase tracking-[0.2em] leading-none mb-1 text-center">{label}</span>
        {cost && <span className="text-xs font-black bg-black/20 text-white px-3 py-1 rounded-md shadow-sm border border-black/10">{cost}</span>}
      </div>

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