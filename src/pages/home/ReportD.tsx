



    "use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Leaf, CameraOff, Loader2 } from "lucide-react";
import supabase from "../../../utils/supabase";

// Interface baseada na sua tabela 'reports'
interface ReportData {
  id: string;
  message: string;
  address: string;
  url?: string;
  created_at: string;
}

export default function DenunciasFeed() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();

    // Opcional: Realtime para atualizar o feed assim que alguém denunciar
    const channel = supabase
      .channel("realtime_reports")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reports" }, 
      (payload) => {
        setReports((prev) => [payload.new as ReportData, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchReports() {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Erro ao carregar denúncias:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="text-emerald-500 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-emerald-500/30 pb-20">
      {/* Background Glow */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/5 blur-[140px] rounded-full" />
      </div>

      <header className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-emerald-500 p-2 rounded-xl">
            <Leaf size={20} className="text-black" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            Patrulha <span className="text-emerald-500">Ativa</span>
          </h1>
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
          Monitoramento de Incidentes em Tempo Real
        </p>
      </header>

      <main className="max-w-2xl mx-auto px-6 space-y-6">
        <AnimatePresence>
          {reports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl transition-all hover:border-white/10"
            >
              {/* Imagem da Evidência */}
              <div className="relative h-64 bg-slate-800/50">
                {report.url ? (
                  <img
                    src={report.url}
                    alt="Evidência"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-2">
                    <CameraOff size={32} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Sem evidência visual</span>
                  </div>
                )}

                {/* Badge de Localização sobre a imagem */}
                <div className="absolute bottom-4 left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                  <MapPin size={14} className="text-rose-500" />
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">
                    {report.address || "Local não informado"}
                  </span>
                </div>
              </div>

              {/* Mensagem da Denúncia */}
              <div className="p-8">
                <p className="text-lg text-slate-200 leading-relaxed font-medium italic">
                  "{report.message}"
                </p>
                
                <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    {new Date(report.created_at).toLocaleDateString('pt-BR')} • ID: {report.id.slice(0, 8)}
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {reports.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Nenhuma denúncia registrada</p>
          </div>
        )}
      </main>
    </div>
  );
}
