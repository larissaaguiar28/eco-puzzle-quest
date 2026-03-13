"use client";

import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera, Save, User, Mail, MapPin, Heart, Check, Loader2,
  Globe, Zap, ShieldCheck, Sparkles
} from "lucide-react";

// Se você não tiver o Shadcn instalado, esses componentes podem falhar. 
// Usei tags padrão estilizadas com Tailwind para garantir que funcione para você.
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import supabase from "../../../utils/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  name: string;
  email: string;
  location: string;
  bio: string;
  avatarUrl?: string;
  interests: string[];
}

const INTEREST_OPTIONS = [
  "Energia Solar", "Reciclagem", "Biodiversidade", "Mudanças Climáticas",
  "Conservação Marinha", "Agricultura Sustentável", "Mobilidade Verde", "Economia Circular",
] as const;

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile>({
    name: "Eco Guardião",
    email: "",
    location: "São Carlos, SP",
    bio: "Sentinela em treinamento focado em impacto ambiental positivo.",
    interests: [],
  });

  const [currentDate, setCurrentDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const now = new Date();
    // Formato: DD.MM.YYYY // HH:mm
    const formatted = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} // ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setCurrentDate(formatted);
  }, []);

  // Sincroniza o email se o usuário estiver logado
  useEffect(() => {
    if (user?.email) {
      setProfile(prev => ({ ...prev, email: user.email as string }));
    }
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfile((prev) => ({ ...prev, avatarUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return alert("Você precisa estar logado!");

    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        name: profile.name,
        email: profile.email,
        location: profile.location,
        bio: profile.bio,
        interests: profile.interests,
        avatar_url: profile.avatarUrl,
        updated_at: new Date()
      });

    if (error) {
      console.error("Erro ao salvar:", error.message);
      alert("Erro ao salvar perfil.");
    } else {
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 3000);
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans p-4 md:p-10 relative overflow-hidden">

      {/* BACKGROUND GLOWS */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[80%] h-[80%] bg-emerald-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-4xl mx-auto space-y-8"
      >
        {/* HEADER - AZUL NEON GAMER */}
        <header className="relative group flex flex-col md:flex-row justify-between items-center md:items-end gap-6 p-8 bg-blue-950/10 backdrop-blur-md border border-cyan-400/30 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-cyan-400/60 shadow-[0_0_40px_-15px_rgba(34,211,238,0.2)]">

          {/* Linha de Scan Animada (Azul) */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 to-transparent h-[2px] animate-scan -z-10" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1">
                {/* Ponto pulsante agora em Ciano */}
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <ShieldCheck size={14} className="text-cyan-400" />
              </div>
              <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                Protocolo_Identidade_Ativo
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
              Settings_<span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">Profile</span>
            </h1>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3 bg-black/40 border border-cyan-400/30 px-5 py-3 rounded-2xl shadow-inner group-hover:border-cyan-400/60 transition-colors">
              <div className="flex flex-col items-end">
                <span className="text-blue-500/50 text-[8px] font-black uppercase tracking-[0.2em]">Sincronia_Temporal</span>
                <p className="text-cyan-400 text-[11px] font-mono font-bold tracking-widest flex items-center gap-2">
                  <Globe size={10} className="animate-spin-slow text-cyan-500" />
                  {currentDate || "SYNCING..."}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* PROFILE CARD - BORDAS MAIS CLARAS E DESTAQUE */}
        <section className="bg-slate-900/40 backdrop-blur-3xl border border-emerald-400/30 p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center relative overflow-hidden shadow-[0_0_50px_-15px_rgba(52,211,153,0.15)] ring-1 ring-white/5">

          {/* Detalhe de luz no canto da borda */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 blur-[50px] -z-10" />

          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-300 via-emerald-500 to-teal-600 p-[3px] shadow-lg shadow-emerald-500/30"
            >
              <div className="w-full h-full rounded-[1.3rem] bg-[#020617] flex items-center justify-center overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-emerald-400/30" />
                )}
              </div>
            </motion.div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-400 text-black p-2 rounded-xl shadow-xl ring-4 ring-[#020617] group-hover:scale-110 transition-transform">
              <Camera size={16} strokeWidth={3} />
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </div>

          <div className="flex-1 space-y-4 w-full text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <p className="text-emerald-300 text-[10px] font-black uppercase tracking-[0.3em]">Status: Conectado</p>
              </div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter drop-shadow-md">
                {profile.name || "Sem Nome"}
              </h2>
              <p className="text-emerald-100/60 text-sm italic font-medium mt-1">"{profile.bio}"</p>
            </div>
          </div>
        </section>

        {/* FORM GRID - CORE DATA COM ESTILO REFORÇADO */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative group">
            {/* Glow sutil atrás do card principal */}
            <div className="absolute -inset-0.5 bg-emerald-500/10 blur-2xl rounded-[2.5rem] -z-10" />

            <div className="bg-slate-900/40 backdrop-blur-2xl border border-emerald-400/30 rounded-[2.5rem] p-8 space-y-8 shadow-2xl ring-1 ring-white/5">

              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                  <Zap size={18} className="text-emerald-400 fill-emerald-400/20" /> Core_Data
                </h3>
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
                  <div className="w-1 h-1 rounded-full bg-emerald-500/30" />
                  <div className="w-1 h-1 rounded-full bg-emerald-500/10" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {[
                  { label: "Codinome", icon: <User size={12} />, name: "name" },
                  { label: "E-mail", icon: <Mail size={12} />, name: "email" },
                  { label: "Localização", icon: <MapPin size={12} />, name: "location" },
                  { label: "Bio", icon: <Heart size={12} />, name: "bio" }
                ].map((field) => (
                  <div key={field.name} className="space-y-2 group/input">
                    <label className="text-[10px] font-black text-emerald-400/80 uppercase tracking-[0.2em] ml-1 flex items-center gap-2 group-focus-within/input:text-emerald-300 transition-colors">
                      {field.icon} {field.label}
                    </label>
                    <div className="relative">
                      <input
                        name={field.name}
                        value={(profile as any)[field.name]}
                        onChange={handleInputChange}
                        className="w-full h-14 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl px-5 text-white placeholder:text-emerald-900/50 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 transition-all duration-300 font-medium"
                        placeholder={`Inserir ${field.label.toLowerCase()}...`}
                      />
                      {/* Linha decorativa de foco */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-emerald-400 group-focus-within/input:w-1/2 transition-all duration-500 blur-[1px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTORS - AZUL GAMER VIBRANTE E COMPACTO */}
        <div className="lg:col-span-1">
          <div className="relative group h-full">
            {/* Glow de fundo azul para destacar a seção */}
            <div className="absolute -inset-1 bg-gradient-to-b from-cyan-500/20 to-transparent blur-2xl opacity-50" />

            <div className="relative bg-gradient-to-br from-blue-950/60 via-slate-900/40 to-cyan-900/20 backdrop-blur-2xl border border-cyan-500/30 rounded-[2.5rem] p-6 h-full shadow-[0_0_40px_-15px_rgba(34,211,238,0.3)] transition-all duration-500 hover:border-cyan-400/50">

              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-black text-cyan-400 italic uppercase tracking-tighter flex items-center gap-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                  <Globe size={18} className="animate-pulse" /> Sectors
                </h3>
                <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-800/50 shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]">
                  {profile.interests.length} / {INTEREST_OPTIONS.length}
                </span>
              </div>

              {/* CONTAINER COM FLEX WRAP - ESTILO TAGS GAMER */}
              <div className="flex flex-wrap gap-2.5">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = profile.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 font-bold text-[10px] uppercase tracking-tighter whitespace-nowrap ${isSelected
                          ? "bg-cyan-400 text-black border-white shadow-[0_0_20px_rgba(34,211,238,0.6)] scale-[1.05] z-10"
                          : "bg-blue-950/40 text-cyan-100/70 border-cyan-500/20 hover:border-cyan-400/50 hover:bg-blue-900/30"
                        }`}
                    >
                      {interest}
                      {isSelected ? (
                        <Check size={12} strokeWidth={4} />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full border border-cyan-800" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Decoração Tech no rodapé do card */}
              <div className="mt-6 pt-4 border-t border-cyan-500/10 flex justify-between items-center opacity-40">
                <div className="h-1 w-12 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <span className="text-[8px] font-bold text-cyan-500 tracking-[0.2em]">DATA_CHIP_V2</span>
              </div>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full max-w-md h-16 rounded-2xl font-black italic uppercase tracking-tighter text-xl transition-all duration-500 flex items-center justify-center gap-3 ${savedStatus
              ? "bg-blue-600 text-white"
              : "bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
              }`}
          >
            {isSaving ? (
              <Loader2 className="animate-spin" />
            ) : savedStatus ? (
              <>Sincronizado <Check /></>
            ) : (
              <>Salvar Alterações <Save size={20} /></>
            )}
          </button>
          <div className="flex items-center gap-2 text-emerald-900 text-[9px] font-black uppercase tracking-[0.5em]">
            <Sparkles size={10} /> Eco-Nexus Protocol 2026
          </div>
        </div>
      </motion.div>
    </div>
  );
}