"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp, Heart, Lightbulb, MessageCircle, Share2,
  CloudRain, Landmark, TreePine, MapPin, Search, Leaf, Sun, LucideIcon, Send,
  Activity, ArrowUpRight, X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import supabase from "../../../utils/supabase";
import { useAuth } from "../../contexts/AuthContext";
import {
  // ... outros ícones
  ChevronLeft, ChevronRight 
} from "lucide-react";

// --- INTERFACES ---
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  date: string;
  location: string;
  gradient: string;
  image?: string;
  likes?: number;
}

interface SidebarItem {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

// --- DADOS ---
const newsData: NewsItem[] = [
  {
    id: "1",
    title: "Brasil bate recorde histórico em geração de energia solar e eólica",
    summary: "O país alcançou a marca de 90% da matriz elétrica renovável neste mês, impulsionando a economia verde.",
    content: "Com novos parques eólicos no Nordeste e fazendas solares no Sudeste, o Brasil não apenas reduziu suas emissões de carbono em 15% no último trimestre, mas também gerou mais de 50 mil novos empregos diretos no setor.",
    category: "Energia Solar",
    author: "EcoS",
    date: "05 Mar 2026",
    location: "Nordeste, BR",
    gradient: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231"
  },
  {
    id: "2",
    title: "Startup desenvolve bioplástico a partir de algas marinhas",
    summary: "Nova embalagem 100% biodegradável se dissolve na água em semanas e já atrai gigantes do varejo.",
    content: "Pesquisadores em parceria com uma startup de biotecnologia criaram um material revolucionário que substitui o plástico de uso único. Feito de sargaço e resíduos da indústria pesqueira.",
    category: "Inovação",
    author: "EcoS",
    date: "04 Mar 2026",
    location: "Rio de Janeiro, BR",
    gradient: "from-cyan-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    id: "3",
    title: "Hortas urbanas verticais transformam telhados em São Paulo",
    summary: "Projeto de agricultura urbana reduz a temperatura dos prédios e fornece alimentos frescos para a comunidade.",
    content: "Uma iniciativa comunitária mapeou e transformou mais de 200 telhados ociosos no centro da capital paulista em fazendas urbanas produtivas. Além de mitigar as ilhas de calor.",
    category: "Conservação",
    author: "EcoS",
    date: "02 Mar 2026",
    location: "São Paulo, BR",
    gradient: "from-emerald-500 to-green-600",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399"
  }
];

const sidebarItems: SidebarItem[] = [
  { label: "Energia Solar", icon: Sun, color: "text-amber-400", bg: "hover:bg-amber-400/10" },
  { label: "Clima", icon: CloudRain, color: "text-cyan-400", bg: "hover:bg-cyan-400/10" },
  { label: "Políticas", icon: Landmark, color: "text-indigo-400", bg: "hover:bg-indigo-400/10" },
  { label: "Inovação", icon: Lightbulb, color: "text-yellow-400", bg: "hover:bg-yellow-400/10" },
  { label: "Conservação", icon: TreePine, color: "text-emerald-400", bg: "hover:bg-emerald-400/10" },
];

// --- COMPONENTE DE NOTÍCIA INDIVIDUAL (FEED) ---
const NewsCard = ({ item }: { item: NewsItem; }) => {
  const [likes, setLikes] = useState(0);
  const [hearts, setHearts] = useState(0);
  const [ideas, setIdeas] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();


  useEffect(() => {
  loadLikes();
  loadComments();
}, [item.id]); // Recarrega se o ID mudar

  async function loadLikes() {
  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("news_id", item.id);
  
  if (!error) setLikes(count || 0);
}

async function handleLike() {
  if (!user) {
    alert("Você precisa estar logado para curtir!");
    return;
  }

  try {
    // 1. Tenta inserir o like
    const { error } = await supabase
      .from("likes")
      .insert({ 
        user_id: user.id, 
        news_id: item.id 
      });

    if (!error) {
      // Sucesso: Recarrega a contagem real do banco
      loadLikes();
    } else if (error.code === '23505') {
      // Se já curtiu (erro de duplicidade), nós removemos (Toggle)
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("news_id", item.id);
      loadLikes();
    } else {
      console.error("Erro ao curtir:", error.message);
    }
  } catch (err) {
    console.error("Erro inesperado:", err);
  }
}

  async function loadComments() {
    const { data, error } = await supabase
      .from("newscomments")
      .select("*")
      .eq("news_id", item.id)
      .order("created_at", { ascending: false });
    if (!error && data) setComments(data);
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    const { error } = await supabase.from("newscomments").insert({
      user_id: user.id,
      news_id: item.id,
      text: newComment
    });
    if (!error) {
      setNewComment("");
      loadComments();
    }
  };

  return (
    <Card className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl group transition-all duration-500 hover:border-white/10">
      <div className={`h-40 bg-gradient-to-br ${item.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <Badge className="absolute top-6 left-6 bg-black/40 text-white backdrop-blur-md border border-white/10 rounded-xl px-4 py-1.5 font-black uppercase italic tracking-tighter">
          {item.category}
        </Badge>
        <ArrowUpRight className="absolute top-6 right-6 text-white/50 group-hover:text-white transition-colors" size={24} />
      </div>

      <CardContent className="p-8 space-y-6">
        <div className="space-y-3">
          <h3
            onClick={() => setExpanded(!expanded)}
            className="cursor-pointer text-3xl font-black text-white leading-[0.9] uppercase italic tracking-tighter group-hover:text-emerald-400 transition-colors"
          >
            {item.title}
          </h3>
          <p className="text-emerald-400/80 font-bold text-sm uppercase tracking-wider italic">{item.summary}</p>
        </div>

        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 text-slate-300">
            {item.image && (
              <img src={item.image} alt={item.title} className="w-full h-60 object-cover rounded-xl mb-4 border border-white/10" />
            )}
            <p className="mb-4 text-sm leading-relaxed">{item.content}</p>
            <div className="text-[10px] text-slate-500 flex gap-4 uppercase font-black tracking-widest border-t border-white/5 pt-4">
              <span>Autor: {item.author}</span>
              <span>Local: {item.location}</span>
            </div>
          </motion.div>
        )}

        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <Avatar className="h-5 w-5 ring-1 ring-emerald-500/50">
              <AvatarFallback className="bg-emerald-500 text-black text-[8px] font-black uppercase">
                {item.author?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="text-slate-300">{item.author}</span>
          </div>
          <span className="text-slate-600">{item.date}</span>
          <span className="flex items-center gap-1.5 text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-full border border-cyan-400/20">
            <MapPin size={12} /> {item.location}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/5">
          <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all uppercase italic tracking-widest active:scale-95">
            <ThumbsUp size={14} /> {likes}
          </button>
          <button onClick={() => setHearts(hearts + 1)} className="flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all uppercase italic tracking-widest active:scale-95">
            <Heart size={14} /> {hearts}
          </button>
          <button onClick={() => setIdeas(ideas + 1)} className="flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all uppercase italic tracking-widest active:scale-95">
            <Lightbulb size={14} /> {ideas}
          </button>
          <div className="flex-1" />
          <button onClick={() => setShowComments(!showComments)} className={`p-3 rounded-xl transition-all border ${showComments ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10'}`}>
            <MessageCircle size={18} />
          </button>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="space-y-4 pt-4">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input placeholder="DIGITE SEU COMENTARIO..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="rounded-xl border-white/10 bg-black/20 text-white focus-visible:ring-emerald-500 text-xs font-bold uppercase tracking-widest" />
                <Button size="icon" type="submit" className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black shrink-0"><Send size={16} /></Button>
              </form>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {comments.map((c) => (
                  <div key={c.id} className="bg-white/5 p-3 rounded-xl text-[10px] font-bold text-slate-300 border border-white/5 tracking-wider uppercase">
                    <span className="text-emerald-400 italic">User_Log: </span>{c.text}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default function SustainableNewsFeed() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user } = useAuth();
  const [newsfeed, setNewsfeed] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedCarousel, setExpandedCarousel] = useState(false); // 🔥 NOVO ESTADO
  const [newNews, setNewNews] = useState({ title: "", summary: "", content: "", category: "", location: "" });

  useEffect(() => {
    loadNewsFeed();
  }, []);

  useEffect(() => {
    if (isPaused || expandedCarousel) return; // 🔥 PAUSA CARROSSEL SE EXPANDIDO
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsData.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, expandedCarousel]);

  async function loadNewsFeed() {
    const { data, error } = await supabase
      .from("newsfeed")
      .select("*")
      .order("date", { ascending: false });
    if (!error && data) setNewsfeed(data);
  }

  async function handlePublish() {
    if (!user) return;
    const { error } = await supabase.from("newsfeed").insert({
      user_id: user.id,
      title: newNews.title,
      summary: newNews.summary,
      content: newNews.content,
      category: newNews.category,
      location: newNews.location,
      author: user.email?.split('@')[0],
      gradient: "from-emerald-500 to-green-600"
    });
    if (error) {
      alert(error.message);
    } else {
      setNewNews({ title: "", summary: "", content: "", category: "", location: "" });
      setShowForm(false);
      loadNewsFeed();
    }
  }

  const filteredNews = newsfeed.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      {/* CARROSSEL AJUSTADO PARA EXPANSÃO */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div 
          className={`relative rounded-[2.5rem] overflow-hidden group transition-all duration-700 ease-in-out ${expandedCarousel ? 'h-[600px]' : 'h-[320px]'}`} 
          onMouseEnter={() => setIsPaused(true)} 
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={newsData[currentIndex].id} 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.8 }} 
              className="absolute inset-0 cursor-pointer"
              onClick={() => setExpandedCarousel(!expandedCarousel)}
            >
              {newsData[currentIndex].image ? (
                <img src={newsData[currentIndex].image} alt={newsData[currentIndex].title} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${newsData[currentIndex].gradient}`} />
              )}
              <div className={`absolute inset-0 bg-black/50 transition-opacity ${expandedCarousel ? 'bg-black/70' : 'bg-black/40'}`} />
              
              <div className={`absolute bottom-0 p-10 space-y-3 transition-all duration-500 ${expandedCarousel ? 'max-w-4xl' : 'max-w-2xl'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{newsData[currentIndex].category}</span>
                  {expandedCarousel && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-white/40 uppercase font-black">Clique para fechar</motion.span>
                  )}
                </div>
                <h2 className={`font-black text-white leading-tight uppercase italic tracking-tighter transition-all ${expandedCarousel ? 'text-6xl' : 'text-4xl'}`}>
                  {newsData[currentIndex].title}
                </h2>
                <p className="text-white/80 text-sm font-medium uppercase tracking-wide">{newsData[currentIndex].summary}</p>
                
                {/* 🔥 CONTEÚDO EXTRA NO CARROSSEL */}
                <AnimatePresence>
                  {expandedCarousel && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="pt-6 mt-6 border-t border-white/10 space-y-4"
                    >
                      <p className="text-slate-300 leading-relaxed text-lg max-w-3xl">
                        {newsData[currentIndex].content}
                      </p>
                      <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
                        <span className="flex items-center gap-2"><MapPin size={14}/> {newsData[currentIndex].location}</span>
                        <span>{newsData[currentIndex].date}</span>
                        <span>BY {newsData[currentIndex].author}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>

          {!expandedCarousel && (
  <>
    <button 
      onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => prev === 0 ? newsData.length - 1 : prev - 1); }} 
      className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-emerald-500 hover:text-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all border border-white/10 backdrop-blur-md active:scale-90"
    >
      <ChevronLeft size={24} strokeWidth={3} />
    </button>
    
    <button 
      onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % newsData.length); }} 
      className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-emerald-500 hover:text-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all border border-white/10 backdrop-blur-md active:scale-90"
    >
      <ChevronRight size={24} strokeWidth={3} />
    </button>
  </>
)}
        </div>
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#020617]/80 border-b border-white/5 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedCategory(null)}>
            <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform"><Leaf size={24} className="text-black" /></div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Eco'S <span className="text-emerald-500">FEED+</span></h1>
              <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em]">Ecoando Noticias</p>
            </div>
          </div>
          <div className="relative w-80 hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50" size={16} />
            <Input placeholder="PESQUISAR NOTICIAS..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-11 rounded-xl border-white/10 bg-white/5 focus-visible:ring-emerald-500 text-xs font-black tracking-widest text-white uppercase placeholder:text-slate-600" />
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-emerald-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl px-6 hover:bg-emerald-400 transition-all">Publicar Notícia</Button>
        </div>
      </header>

      {/* RESTANTE DO CÓDIGO (ASIDE E MAIN) PERMANECE IGUAL AO ANTERIOR */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 py-10">
        <aside className="hidden lg:block col-span-1">
          <div className="sticky top-32 space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 space-y-4 shadow-xl">
              <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Activity size={14} /> Filtros de Campo</h2>
              <div className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = selectedCategory === item.label;
                  return (
                    <button key={item.label} onClick={() => setSelectedCategory(isActive ? null : item.label)} className={`flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${isActive ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg italic' : `text-slate-400 border-transparent hover:border-white/10 ${item.bg}`}`}><Icon size={18} className={isActive ? 'text-black' : item.color} />{item.label}</button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <main className="col-span-1 lg:col-span-3 space-y-10">
          <AnimatePresence mode="popLayout">
            {filteredNews.map((item) => (
              <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}>
                <NewsCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredNews.length === 0 && (
            <div className="text-center py-32 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-white/5 backdrop-blur-sm">
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs italic">Nenhum registro encontrado no Database</p>
              <Button variant="link" onClick={() => setSelectedCategory(null)} className="text-emerald-400 uppercase font-black text-[10px] tracking-widest mt-4">Resetar Conexão</Button>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-[2rem] p-8 z-50 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-white uppercase italic italic">✨ Criar Broadcast</h2>
                <button onClick={() => setShowForm(false)} className="text-white/60 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Título" value={newNews.title} onChange={(e) => setNewNews({ ...newNews, title: e.target.value })} className="bg-black/30 border-white/10 text-white rounded-xl" />
                  <Input placeholder="Categoria" value={newNews.category} onChange={(e) => setNewNews({ ...newNews, category: e.target.value })} className="bg-black/30 border-white/10 text-white rounded-xl" />
                </div>
                <Input placeholder="Resumo" value={newNews.summary} onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })} className="bg-black/30 border-white/10 text-white rounded-xl" />
                <Input placeholder="Localização" value={newNews.location} onChange={(e) => setNewNews({ ...newNews, location: e.target.value })} className="bg-black/30 border-white/10 text-white rounded-xl" />
                <textarea placeholder="Conteúdo completo..." className="w-full p-4 rounded-2xl bg-black/30 text-white border border-white/10 min-h-[120px] focus:outline-none focus:border-emerald-500/50 transition-colors" value={newNews.content} onChange={(e) => setNewNews({ ...newNews, content: e.target.value })} />
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="ghost" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">Cancelar</Button>
                  <Button onClick={handlePublish} className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase px-8 rounded-xl italic">Publicar 🚀</Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}