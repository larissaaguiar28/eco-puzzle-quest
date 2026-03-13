"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Save, User, Mail, MapPin, Heart, Check, Loader2,
  Leaf, Globe, Wind, Sparkles, ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import supabase from "../../../utils/supabase";
import { useAuth } from "../../contexts/AuthContext";


interface UserProfile {
  name?: string;
  email?: string;
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
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  const {user, signOutUser}=useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    name: `Eco Guardião${randomNumber}`,
    email: "",
    location: "Cidade, Estado",
    bio: "Conte um pouco sobre você...",
    interests: [""],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

 

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
    setIsSaving(true);
    const data = {...profile, 
      user_id: user?.id,
      email: user?.email,
      level: 1,
      role: "user",
      bonus: false,
      active: true,
    }

    const {error}=await supabase.from('profiles')
    .insert(data);

    if (error){
      alert(error.message);
      return
    }
    
    setIsSaving(false);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);

    alert ('Cadastrado com sucesso')
  
  };

  return (
    // NOVO FUNDO: Degradê de Verde Escuro para Verde Claro
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-teal-950 via-emerald-900 to-emerald-500">

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">

        <header className="space-y-2 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center md:justify-start gap-2 text-emerald-200 font-bold tracking-widest uppercase text-xs"
          >
            <Sparkles size={14} /> Eco-Puzzle Quest
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold text-white drop-shadow-md"
          >
            Configurações de <span className="text-emerald-300 underline decoration-emerald-400/50 underline-offset-8">Perfil</span>
          </motion.h1>
        </header>

        {/* Card de Identidade */}
        <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-md overflow-hidden rounded-3xl">
          <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="relative group" onClick={() => fileInputRef.current?.click()}>
              <Avatar className="h-32 w-32 border-4 border-emerald-100 shadow-2xl relative cursor-pointer group-hover:rotate-3 transition-all duration-300">
                <AvatarImage src={profile.avatarUrl} className="object-cover" />
                <AvatarFallback className="bg-emerald-600 text-white text-4xl font-bold">
                  {profile.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 bg-emerald-500 p-2.5 rounded-full shadow-lg text-white border-2 border-white">
                <Camera size={18} />
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <h2 className="text-2xl font-black text-slate-800 flex items-center justify-center md:justify-start gap-2">
                {profile.name} <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </h2>
              <p className="text-slate-500 italic text-sm leading-relaxed max-w-md">"{profile.bio}"</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                {profile.interests.map(i => (
                  <span key={i} className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full font-bold uppercase tracking-tighter">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário e Interesses */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-white/95 border-none shadow-xl rounded-3xl">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-lg text-slate-800">Dados Pessoais</h3>
                </div>
                <Leaf className="w-5 h-5 text-emerald-200" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormField label="Nome de Exibição" icon={<User size={14} />}>
                  <Input
                    name="name"
                    value={profile.name}
                    onChange={(e)=>setProfile ({...profile, name: e.target.value
                    })}

                    className="h-12 bg-slate-50/50 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 rounded-xl"
                  />
                </FormField>

                <FormField label="E-mail" icon={<Mail size={14} />}>
                  <Input
                    name="email"
                    value={user?.email || ""}
                    readOnly
                    className="h-12 bg-slate-50/50 border-slate-200 focus:border-emerald-500 text-slate-900 rounded-xl"
                  />
                </FormField>

                <FormField label="Localização" icon={<MapPin size={14} />}>
                  <Input
                    name="location"
                    value={profile.location}
                   onChange={(e)=>setProfile ({...profile, location: e.target.value
                    })}
                    className="h-12 bg-slate-50/50 border-slate-200 focus:border-emerald-500 text-slate-900 rounded-xl"
                  />
                </FormField>

                <FormField label="Bio" icon={<Heart size={14} />}>
                  <Input
                    name="bio"
                    value={profile.bio}
                   onChange={(e)=>setProfile ({...profile, bio: e.target.value
                    })}
                    
                    className="h-12 bg-slate-50/50 border-slate-200 focus:border-emerald-500 text-slate-900 rounded-xl"
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 border-none shadow-xl rounded-3xl">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <Globe className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-lg text-slate-800">Interesses Ambientais</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = profile.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-300 border-2",
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200 scale-105"
                          : "bg-white text-slate-500 border-slate-100 hover:border-emerald-300 hover:text-emerald-600"
                      )}
                    >
                      {interest}
                      {isSelected && <Check size={16} className="animate-in zoom-in" />}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* BOTÃO SALVAR: Centralizado e Moderno */}
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="flex justify-center">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "w-full h-16 text-xl font-black transition-all duration-500 rounded-2xl border-b-4 flex items-center justify-center gap-3",
              savedStatus
                ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
                <span>Atualizando Ecossistema...</span>
              </>
            ) : savedStatus ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-3"
              >
                <Check className="h-7 w-7" />
                <span>Perfil Sincronizado!</span>
              </motion.div>
            ) : (
              <>
                <Save className="h-6 w-6 opacity-70" />
                <span>Salvar Alterações</span>
              </>
            )}
          </Button>
        </motion.div>

        <p className="text-center text-emerald-100/50 text-xs font-medium">
          Eco-Puzzle Quest © 2026 - Protegendo o Planeta Digital
        </p>
      </div>
    </div>
  );
}

function FormField({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2 ml-1">
        {icon} {label}
      </label>
      {children}
    </div>
  );
}