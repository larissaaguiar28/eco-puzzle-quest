"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp, Heart, Lightbulb, MessageCircle, Share2,
  CloudRain, Landmark, TreePine, MapPin, Search, Leaf, Sun, LucideIcon, Send,
  Activity, ArrowUpRight, X, ChevronLeft, ChevronRight 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import supabase from "../../../utils/supabase";
import { useAuth } from "../../contexts/AuthContext";

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
}

interface SidebarItem {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

// --- DADOS ESTÁTICOS (CARROSSEL) ---
const newsData: NewsItem[] = [
  {
    id: "17002176-f5e8-4c29-86ae-784ca93f72af",
    title: "Brasil bate recorde histórico em geração de energia solar e eólica",
    summary: "O país alcançou a marca de 90% da matriz elétrica renovável neste mês, impulsionando a economia verde.",
    content: "Com novos parques eólicos no Nordeste e fazendas solares no Sudeste, o Brasil não apenas reduziu suas emissões de carbono em 15% no último trimestre, mas também gerou mais de 50 mil novos empregos diretos no setor.",
    category: "Energia Solar",
    author: "EcoS",
    date: new Date().toISOString(),
    location: "Nordeste, BR",
    gradient: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231"
  }
];;

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
    loadReactions();
    loadComments();
  }, [item.id]);

  async function loadReactions() {
    const { data, error } = await supabase
      .from("reactions")
      .select("type")
      .eq("news_id", item.id);

    if (!error && data) {
      setLikes(data.filter(r => r.type === "like").length);
      setHearts(data.filter(r => r.type === "heart").length);
      setIdeas(data.filter(r => r.type === "idea").length);
    }
  }

  async function handleReaction(type: "like" | "heart" | "idea") {
    if (!user) {
      alert("Você precisa estar logado!");
      return;
    }

    const { error } = await supabase
      .from("reactions")
      .insert({ user_id: user.id, news_id: item.id, type: type });

    if (error && error.code === "23505") {
      await supabase
        .from("reactions")
        .delete()
        .match({ user_id: user.id, news_id: item.id, type: type });
    }

    loadReactions();
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

  // Formatação segura da data
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
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
          <span className="text-slate-600">{formatDate(item.date)}</span>
          <span className="flex items-center gap-1.5 text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-full border border-cyan-400/20">
            <MapPin size={12} /> {item.location}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/5">
          <button onClick={() => handleReaction("like")} className={`flex items-center gap-1.5 transition-colors ${likes > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
            <ThumbsUp size={14} className={likes > 0 ? "fill-emerald-400/20" : ""} /> 
            <span className="font-black">{likes}</span>
          </button>
          <button onClick={() => handleReaction("heart")} className={`flex items-center gap-1.5 transition-colors ${hearts > 0 ? 'text-pink-500' : 'text-slate-400'}`}>
            <Heart size={14} className={hearts > 0 ? "fill-pink-500/20" : ""} /> 
            <span className="font-black">{hearts}</span>
          </button>
          <button onClick={() => handleReaction("idea")} className={`flex items-center gap-1.5 transition-colors ${ideas > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            <Lightbulb size={14} className={ideas > 0 ? "fill-amber-400/20" : ""} /> 
            <span className="font-black">{ideas}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="ml-auto text-slate-400 hover:text-white flex items-center gap-2">
            <MessageCircle size={14} />
            <span className="font-black text-[10px]">{comments.length}</span>
          </button>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="space-y-4 pt-4">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input placeholder="DIGITE SEU COMENTARIO..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="rounded-xl border-white/10 bg-black/20 text-white text-xs font-bold uppercase tracking-widest" />
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
  const [expandedCarousel, setExpandedCarousel] = useState(false);
  const [newNews, setNewNews] = useState({ title: "", summary: "", content: "", category: "", location: "" });

  useEffect(() => {
    loadNewsFeed();
  }, []);

  useEffect(() => {
    if (isPaused || expandedCarousel || newsData.length === 0) return;
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
      gradient: "from-emerald-500 to-green-600",
      date: new Date().toISOString() // CORREÇÃO: Envia formato ISO aceito pelo Postgres
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

      {/* CARROSSEL */}
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
              <div className={`w-full h-full bg-gradient-to-br ${newsData[currentIndex].gradient}`} />
              <div className={`absolute inset-0 bg-black/50 transition-opacity ${expandedCarousel ? 'bg-black/70' : 'bg-black/40'}`} />
              
              <div className={`absolute bottom-0 p-10 space-y-3 transition-all duration-500 ${expandedCarousel ? 'max-w-4xl' : 'max-w-2xl'}`}>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{newsData[currentIndex].category}</span>
                <h2 className={`font-black text-white leading-tight uppercase italic tracking-tighter transition-all ${expandedCarousel ? 'text-6xl' : 'text-4xl'}`}>
                  {newsData[currentIndex].title}
                </h2>
                <p className="text-white/80 text-sm font-medium uppercase tracking-wide">{newsData[currentIndex].summary}</p>
                {expandedCarousel && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-300 pt-4 border-t border-white/10">{newsData[currentIndex].content}</motion.p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#020617]/80 border-b border-white/5 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedCategory(null)}>
            <div className="bg-emerald-500 p-2.5 rounded-2xl"><Leaf size={24} className="text-black" /></div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Eco'S <span className="text-emerald-500">FEED+</span></h1>
              <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em]">Ecoando Noticias</p>
            </div>
          </div>
          <div className="relative w-80 hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50" size={16} />
            <Input placeholder="PESQUISAR..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-11 rounded-xl border-white/10 bg-white/5 text-white uppercase text-xs font-black tracking-widest" />
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-emerald-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl px-6">Publicar Notícia</Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 py-10">
        <aside className="hidden lg:block col-span-1">
          <div className="sticky top-32 space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 space-y-4">
              <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2"><Activity size={14} /> Filtros</h2>
              <div className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = selectedCategory === item.label;
                  return (
                    <button key={item.label} onClick={() => setSelectedCategory(isActive ? null : item.label)} className={`flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${isActive ? 'bg-emerald-500 text-black border-emerald-500 italic' : 'text-slate-400 border-transparent hover:border-white/10'}`}>
                      <Icon size={18} className={isActive ? 'text-black' : item.color} />
                      {item.label}
                    </button>
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
            <div className="text-center py-32 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-white/5">
              <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Database Vazio ou Sem Resultados</p>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2rem] p-8 z-50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-white uppercase italic">✨ Criar Broadcast</h2>
                <button onClick={() => setShowForm(false)} className="text-white/60 hover:text-white"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Título" value={newNews.title} onChange={(e) => setNewNews({ ...newNews, title: e.target.value })} className="bg-black/30 border-white/10 text-white rounded-xl" />
                  <Input placeholder="Categoria" value={newNews.category} onChange={(e) => setNewNews({ ...newNews, category: e.target.value })} className="bg-black/30 border-white/10 text-white rounded-xl" />
                </div>
                <Input placeholder="Resumo" value={newNews.summary} onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })} className="bg-black/30 border-white/10 text-white rounded-xl" />
                <Input placeholder="Localização" value={newNews.location} onChange={(e) => setNewNews({ ...newNews, location: e.target.value })} className="bg-black/30 border-white/10 text-white rounded-xl" />
                <textarea placeholder="Conteúdo..." className="w-full p-4 rounded-2xl bg-black/30 text-white border border-white/10 min-h-[120px] focus:outline-none" value={newNews.content} onChange={(e) => setNewNews({ ...newNews, content: e.target.value })} />
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="ghost" onClick={() => setShowForm(false)} className="text-slate-400">Cancelar</Button>
                  <Button onClick={handlePublish} className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase px-8 rounded-xl italic">Publicar </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}