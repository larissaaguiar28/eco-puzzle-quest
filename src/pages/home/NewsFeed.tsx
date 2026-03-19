"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp, Heart, Lightbulb, MessageCircle, Share2,
  CloudRain, Landmark, TreePine, MapPin, Search, Leaf, Sun, LucideIcon, Send,
  Activity, ArrowUpRight, Plus, X, Pin, ChevronLeft, ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import supabase from "../../../utils/supabase";
import { useAuth } from "../../contexts/AuthContext";

// --- INTERFACES ---
interface NewsItem {
  id?: number | string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  date: Date | string;
  location: string;
  likes: number;
  hearts: number;
  ideas: number;
  gradient: string;
}

interface SidebarItem {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

// --- NOTÍCIAS FIXAS DO SITE (CARROSSEL) ---
const FIXED_NEWS: NewsItem[] = [
  {
    id: "f1",
    title: "Brasil Lidera Ranking de Energia Clean 2026",
    summary: "Atingimos 92% de matriz renovável este mês.",
    content: "O relatório oficial do ministério aponta que a expansão das fazendas solares no Nordeste foi o principal motor dessa conquista histórica para a sustentabilidade nacional.",
    category: "Políticas",
    author: "EcoS Oficial",
    date: new Date(),
    location: "Brasília, DF",
    likes: 240,
    hearts: 88,
    ideas: 45,
    gradient: "from-emerald-600 to-cyan-600"
  },
  {
    id: "f2",
    title: "Inovação: Grafeno na Filtragem de Oceanos",
    summary: "Nova tecnologia brasileira remove 99% dos microplásticos.",
    content: "Pesquisadores da USP desenvolveram uma membrana de baixo custo que promete revolucionar a limpeza dos oceanos, utilizando subprodutos da indústria local.",
    category: "Inovação",
    author: "EcoS Tech",
    date: new Date(),
    location: "São Paulo, SP",
    likes: 90,
    hearts: 35,
    ideas: 29,
    gradient: "from-blue-600 to-indigo-600"
  }
];

const sidebarItems: SidebarItem[] = [
  { label: "Energia Solar", icon: Sun, color: "text-amber-400", bg: "hover:bg-amber-400/10" },
  { label: "Clima", icon: CloudRain, color: "text-cyan-400", bg: "hover:bg-cyan-400/10" },
  { label: "Políticas", icon: Landmark, color: "text-indigo-400", bg: "hover:bg-indigo-400/10" },
  { label: "Inovação", icon: Lightbulb, color: "text-yellow-400", bg: "hover:bg-yellow-400/10" },
  { label: "Conservação", icon: TreePine, color: "text-emerald-400", bg: "hover:bg-emerald-400/10" },
];

// --- COMPONENTE NEWS CARD ---
const NewsCard = ({ item, isFixed = false }: { item: NewsItem, isFixed?: boolean }) => {
  const [likes, setLikes] = useState(item.likes || 0);
  const [hearts, setHearts] = useState(item.hearts || 0);
  const [ideas, setIdeas] = useState(item.ideas || 0);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState<{user_name: string, text: string}[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (showComments && !isFixed) {
      fetchComments();
    }
  }, [showComments]);

  async function fetchComments() {
    const { data, error } = await supabase
      .from('newscomments')
      .select('user_name, text')
      .eq('news_id', item.id)
      .order('created_at', { ascending: true });
    if (!error && data) setCommentsList(data);
  }

  async function handleReaction(field: 'likes' | 'hearts' | 'ideas', setter: any, current: number) {
    const newVal = current + 1;
    setter(newVal);
    if (!isFixed) {
      await supabase.from('newsfeed').update({ [field]: newVal }).eq('id', item.id);
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isFixed) return;

    const newComment = {
      news_id: item.id,
      user_name: user?.user_metadata?.name || "Eco_User",
      text: comment
    };

    const { error } = await supabase.from('newscomments').insert([newComment]);
    if (!error) {
      setCommentsList([...commentsList, { user_name: newComment.user_name, text: newComment.text }]);
      setComment("");
    }
  };

  return (
    <Card className="rounded-[2.5rem] overflow-hidden border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl group transition-all duration-500 hover:border-white/10 w-full">
      <div className={`h-40 bg-gradient-to-br ${item.gradient || 'from-emerald-500 to-green-600'} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <Badge className="absolute top-6 left-6 bg-black/40 text-white backdrop-blur-md border border-white/10 rounded-xl px-4 py-1.5 font-black uppercase italic tracking-tighter">
          {item.category}
        </Badge>
        {isFixed && (
           <Badge className="absolute top-6 right-6 bg-amber-500 text-black border-none rounded-xl px-3 py-1.5 font-black uppercase italic flex items-center gap-1">
             <Pin size={12} /> Destaque
           </Badge>
        )}
      </div>

      <CardContent className="p-8 space-y-6">
        <div className="space-y-3">
          <h3 className={`${isFixed ? 'text-2xl' : 'text-3xl'} font-black text-white leading-[0.9] uppercase italic tracking-tighter group-hover:text-emerald-400 transition-colors line-clamp-2`}>
            {item.title}
          </h3>
          <p className="text-emerald-400/80 font-bold text-sm uppercase tracking-wider italic">{item.summary}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="bg-emerald-500 text-black text-[8px] font-black uppercase">
                {item.author?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="text-slate-300">{item.author}</span>
          </div>
          <span className="text-slate-600">{new Date(item.date).toLocaleDateString()}</span>
          <span className="flex items-center gap-1.5 text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-full border border-cyan-400/20">
            <MapPin size={12} /> {item.location}
          </span>
        </div>

        <p className="text-slate-400 leading-relaxed text-sm font-medium line-clamp-3">{item.content}</p>

        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/5">
          <button 
            onClick={() => handleReaction('likes', setLikes, likes)} 
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all uppercase italic active:scale-95"
          >
            <ThumbsUp size={14} /> {likes}
          </button>
          
          <button 
            onClick={() => handleReaction('hearts', setHearts, hearts)}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all uppercase italic active:scale-95"
          >
            <Heart size={14} /> {hearts}
          </button>

          <button 
            onClick={() => handleReaction('ideas', setIdeas, ideas)}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all uppercase italic active:scale-95"
          >
            <Lightbulb size={14} /> {ideas}
          </button>
          
          <div className="flex-1" />
          <button onClick={() => setShowComments(!showComments)} className={`p-3 rounded-xl transition-all border ${showComments ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-400'}`}>
            <MessageCircle size={18} />
          </button>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-4 space-y-4 overflow-hidden">
              {!isFixed && (
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <Input 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="DIGITE UM COMENTÁRIO..." 
                    className="bg-white/5 border-white/20 rounded-xl text-[10px] font-bold uppercase text-white"
                  />
                  <button type="submit" className="bg-emerald-500 p-2 rounded-xl text-black shrink-0">
                    <Send size={14} />
                  </button>
                </form>
              )}

              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scroll">
                {commentsList.map((c, i) => (
                  <div key={i} className="bg-white/10 p-3 rounded-2xl border border-white/10">
                    <p className="text-emerald-400 text-[9px] font-black uppercase mb-1">{c.user_name}</p>
                    <p className="text-white text-xs font-semibold">{c.text}</p>
                  </div>
                ))}
                {commentsList.length === 0 && <p className="text-[10px] text-slate-500 text-center py-2 uppercase font-black italic">Sem comentários.</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function SustainableNewsFeed() {
  const { user } = useAuth();
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [newPost, setNewPost] = useState({ title: "", summary: "", content: "", category: "Energia Solar", location: "Brasil" });

  useEffect(() => { loadingNewsfeed(); }, [user]);

  async function loadingNewsfeed() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('newsfeed').select('*').order('id', { ascending: false });
      if (error) throw error;
      setNewsFeed(data || []);
    } catch (error: any) {
      console.error("Erro:", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    const gradients = ["from-amber-500 to-orange-600", "from-cyan-500 to-blue-600", "from-emerald-500 to-green-600"];
    const postToInsert = {
      ...newPost,
      author: user?.user_metadata?.name || "User_" + Math.floor(Math.random() * 1000),
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      hearts: 0,
      ideas: 0,
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
      user_id: user?.id
    };
    const { error } = await supabase.from('newsfeed').insert([postToInsert]);
    if (!error) {
      setIsCreateOpen(false);
      setNewPost({ title: "", summary: "", content: "", category: "Energia Solar", location: "Brasil" });
      loadingNewsfeed();
    }
  }

  const nextSlide = () => setCurrentIdx((prev) => (prev + 1) % FIXED_NEWS.length);
  const prevSlide = () => setCurrentIdx((prev) => (prev - 1 + FIXED_NEWS.length) % FIXED_NEWS.length);

  const filteredNews = newsFeed.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#020617]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedCategory(null)}>
            <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
              <Leaf size={24} className="text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Eco'S <span className="text-emerald-500">FEED+</span></h1>
              <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em]">Broadcast Sustentável</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50" size={14} />
              <Input
                placeholder="BUSCAR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-10 rounded-xl border-white/10 bg-white/5 text-[10px] font-black uppercase"
              />
            </div>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase italic rounded-xl px-6">
              <Plus size={18} className="mr-2" /> Publique
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 py-10">
        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-4 bg-slate-900/40 p-6 rounded-[2rem] border border-white/5">
            <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2"><Activity size={14} /> Filtros</h2>
            {sidebarItems.map((item) => (
              <button 
                key={item.label} 
                onClick={() => setSelectedCategory(selectedCategory === item.label ? null : item.label)}
                className={`flex items-center gap-3 w-full px-5 py-3 rounded-2xl text-[11px] font-black uppercase transition-all border ${selectedCategory === item.label ? 'bg-emerald-500 text-black border-emerald-500' : 'text-slate-400 border-transparent hover:bg-white/5'}`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="col-span-3 space-y-10">
          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Destaques</h2>
                <div className="flex gap-2">
                  <button onClick={prevSlide} className="p-2 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/5"><ChevronLeft size={16} /></button>
                  <button onClick={nextSlide} className="p-2 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/5"><ChevronRight size={16} /></button>
                </div>
             </div>
             <div className="relative overflow-hidden rounded-[2.5rem]">
                <AnimatePresence mode="wait">
                  <motion.div key={currentIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <NewsCard item={FIXED_NEWS[currentIdx]} isFixed={true} />
                  </motion.div>
                </AnimatePresence>
             </div>
          </section>

          <div className="space-y-6">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Comunidade</h2>
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <div className="text-center py-20 text-xs font-black uppercase text-emerald-500 animate-pulse">Sincronizando...</div>
              ) : filteredNews.map((item) => (
                <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
                  <NewsCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[2.5rem] p-10 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">PUBLICAR_<span className="text-emerald-500">NEWS</span></h2>
                <button onClick={() => setIsCreateOpen(false)} className="text-slate-500 hover:text-white"><X size={32} /></button>
              </div>
              <form onSubmit={handleCreatePost} className="space-y-6">
                <Input required value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} className="bg-white/5 border-white/10 h-12 uppercase font-bold" placeholder="TÍTULO" />
                <select className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase px-4 text-slate-300" value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value})}>
                  {sidebarItems.map(si => <option key={si.label} value={si.label} className="bg-slate-900">{si.label}</option>)}
                </select>
                <Input required value={newPost.summary} onChange={e => setNewPost({...newPost, summary: e.target.value})} className="bg-white/5 border-white/10 h-12" placeholder="RESUMO" />
                <Textarea required value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} className="bg-white/5 border-white/10 min-h-[140px]" placeholder="CONTEÚDO..." />
                <div className="grid grid-cols-2 gap-6">
                  <Input value={newPost.location} onChange={e => setNewPost({...newPost, location: e.target.value})} className="bg-white/5 border-white/10 h-12 uppercase" placeholder="LOCALIZAÇÃO" />
                  <Button type="submit" className="h-12 bg-emerald-500 text-black font-black uppercase italic">POSTAR</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
      `}</style>
    </div>
  );
}