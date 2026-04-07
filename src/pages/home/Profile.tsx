"use client";

import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera, Save, User, Mail, MapPin, Heart, Check, Loader2,
  Globe, Zap, ShieldCheck, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import supabase from "../../../utils/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// --- COMPONENTES AUXILIARES (Para evitar erros de importação) ---

const FormField = ({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest ml-1">
      {icon}
      {label}
    </label>
    {children}
  </div>
);

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "w-full px-4 py-3 bg-black/40 border border-emerald-500/20 rounded-xl",
      "text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-400/60",
      "focus:ring-1 focus:ring-emerald-400/30 transition-all duration-300 outline-none",
      className
    )}
  />
);

// --- CONFIGURAÇÕES ---

interface UserProfile {
  name?: string;
  email?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  interests: string[];
}

const INTEREST_OPTIONS = [
  "Energia Solar", "Reciclagem", "Biodiversidade", "Mudanças Climáticas",
  "Conservação Marinha", "Agricultura Sustentável", "Mobilidade Verde", "Economia Circular",
] as const;

export default function Profile() {
  const { toast } = useToast();
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  const {user, signOutUser}=useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    name: `Eco Guardião${randomNumber}`,
    email: "",
    location: "Cidade, Estado",
    bio: "Conte um pouco sobre você...",
    interests: [],
  });

  const [currentDate, setCurrentDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(user?.email){
      setProfile(prev => ({ ...prev, email: user.email as string}));
    }
  }, [user]);

  useEffect(() => {
    if(user) syncprofile(user.id);
  }, []);

  async function syncprofile(user_id: string): Promise < void> {
    const { data, error } = await supabase.from('profiles')
    .select('*').eq("user_id", user_id)
    .maybeSingle();

    if(error){
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message
      });
      return
    }
    if(data){
      setProfile(data)
    }
  }

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
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado!"
      });
      return;
    }
    setIsSaving(true);

    const data = {
      ...profile,
       user_id: user?.id,
      email: user?.email,
      role: "user",
      bonus: false,
      active: true,
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(data); // Upsert atualiza se já existir ou insere se for novo

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message
      });
      setIsSaving(false);
      return;
    }
    setIsSaving(false);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
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
        {/* HEADER */}
        <header className="relative group flex flex-col md:flex-row justify-between items-center md:items-end gap-6 p-8 bg-blue-950/10 backdrop-blur-md border border-cyan-400/30 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-cyan-400/60 shadow-[0_0_40px_-15px_rgba(34,211,238,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 to-transparent h-[2px] animate-pulse -z-10" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <ShieldCheck size={14} className="text-cyan-400" />
              </div>
              <span className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em]">
                Protocolo_Identidade_Ativo
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
              Eco-<span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">Perfil</span>
            </h1>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3 bg-black/40 border border-cyan-400/30 px-5 py-3 rounded-2xl">
              <div className="flex flex-col items-end">
                <span className="text-blue-500/50 text-[8px] font-black uppercase tracking-[0.2em]">Sincronia_Temporal</span>
                <p className="text-cyan-400 text-[11px] font-mono font-bold tracking-widest flex items-center gap-2">
                  <Globe size={10} className="text-cyan-500" />
                  {currentDate || "SYNCING..."}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* PROFILE CARD */}
        <section className="bg-slate-900/40 backdrop-blur-3xl border border-emerald-400/30 p-6 md:p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center relative overflow-hidden shadow-[0_0_50px_-15px_rgba(52,211,153,0.15)]">
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
            <div className="absolute -bottom-2 -right-2 bg-emerald-400 text-black p-2 rounded-xl ring-4 ring-[#020617]">
              <Camera size={16} strokeWidth={3} />
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </div>

          <div className="flex-1 space-y-4 w-full text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-emerald-300 text-[10px] font-black uppercase tracking-[0.3em]">Status: Conectado</p>
              </div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                {profile.name || "Sem Nome"}
              </h2>
              <p className="text-emerald-100/60 text-sm italic font-medium mt-1">
                {profile.bio || "Bio não definida..."}
              </p>
            </div>
          </div>
        </section>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-2xl border border-emerald-400/30 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                <Zap size={18} className="text-emerald-400" /> Core_Data
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormField label="Nome de Exibição" icon={<User size={14} />}>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Seu nome"
                  />
                </FormField>

                <FormField label="E-mail" icon={<Mail size={14} />}>
                  <Input
                    onChange={(e)=>setProfile ({...profile, email: e.target.value})}
                    value={user?.email || ""}
                    readOnly
                    className="opacity-60 cursor-not-allowed border-slate-700"
                  />
                </FormField>

                <FormField label="Localização" icon={<MapPin size={14} />}>
                  <Input
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="Ex: São Paulo, SP"
                  />
                </FormField>

                <FormField label="Bio Curta" icon={<Heart size={14} />}>
                  <Input
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Sobre você..."
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* SECTORS */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-950/60 via-slate-900/40 to-cyan-900/20 backdrop-blur-2xl border border-cyan-500/30 rounded-[2.5rem] p-6 h-full shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-black text-cyan-400 italic uppercase tracking-tighter flex items-center gap-2">
                  <Globe size={18} /> Sectors
                </h3>
                <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-800/50">
                  {profile.interests.length} / {INTEREST_OPTIONS.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = profile.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-300 font-bold text-[9px] uppercase tracking-tighter ${isSelected
                        ? "bg-cyan-400 text-black border-white shadow-[0_0_15px_rgba(34,211,238,0.5)] scale-105"
                        : "bg-blue-950/40 text-cyan-100/70 border-cyan-500/20 hover:border-cyan-400/40"
                        }`}
                    >
                      {interest}
                      {isSelected && <Check size={10} strokeWidth={4} />}
                    </button>
                  );
                })}
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
              } disabled:opacity-50`}
          >
            {isSaving ? (
              <Loader2 className="animate-spin" />
            ) : savedStatus ? (
              <>Sincronizado <Check /></>
            ) : (
              <>Salvar Alterações <Save size={20} /></>
            )}
          </button>
          <div className="flex items-center gap-2 text-emerald-500/40 text-[9px] font-black uppercase tracking-[0.5em]">
            <Sparkles size={10} /> Eco-Nexus Protocol 2026
          </div>
        </div>
      </motion.div>
    </div>
  );
}