"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp, Heart, Lightbulb, MessageCircle, Share2,
  CloudRain, Landmark, TreePine, MapPin, Search, Leaf, Sun, LucideIcon, Send,
  Activity, ArrowUpRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import supabase from "../../../utils/supabase";
import {useAuth}from "../../contexts/AuthContext";


// --- INTERFACES (Mantidas) ---
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

// --- DADOS (Mantidos) ---
const newsData: NewsItem[] = [
  {
    id:"1",
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
    image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231"
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
    gradient: "from-emerald-500 to-green-600" 
  }
];

const sidebarItems: SidebarItem[] = [
  { label: "Energia Solar", icon: Sun, color: "text-amber-400", bg: "hover:bg-amber-400/10" },
  { label: "Clima", icon: CloudRain, color: "text-cyan-400", bg: "hover:bg-cyan-400/10" },
  { label: "Políticas", icon: Landmark, color: "text-indigo-400", bg: "hover:bg-indigo-400/10" },
  { label: "Inovação", icon: Lightbulb, color: "text-yellow-400", bg: "hover:bg-yellow-400/10" },
  { label: "Conservação", icon: TreePine, color: "text-emerald-400", bg: "hover:bg-emerald-400/10" },
];

// --- COMPONENTE DE NOTÍCIA INDIVIDUAL (DESIGN ATUALIZADO) ---
const NewsCard = ({ item }: { item: NewsItem;  }) => {
  const [likes, setLikes] = useState(0);
  const [hearts, setHearts] = useState(Math.floor(item.likes / 3));
  const [ideas, setIdeas] = useState(Math.floor(item.likes / 5));
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<{id: number, text: string}[]>([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();


  useEffect(() => {
  loadLikes();
}, []);

async function loadLikes() {
  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("news_id", item.id);

  setLikes(count || 0);
}


async function handleLike() {
  if (!user) return;

  await supabase.from("likes").insert({
    user_id: user.id,
    news_id: item.id
  });

  setLikes((prev) => prev + 1);
}

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now(), text: newComment }]);
      setNewComment("");
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
          <h3 className="text-3xl font-black text-white leading-[0.9] uppercase italic tracking-tighter group-hover:text-emerald-400 transition-colors cursor-pointer">
            {item.title}
          </h3>
          <p className="text-emerald-400/80 font-bold text-sm uppercase tracking-wider italic">{item.summary}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <Avatar className="h-5 w-5 ring-1 ring-emerald-500/50">
              <AvatarFallback className="bg-emerald-500 text-black text-[8px] font-black uppercase">
                {item.author.substring(0,2)}
              </AvatarFallback>
            </Avatar>
            <span className="text-slate-300">{item.author}</span>
          </div>
          <span className="text-slate-600">{item.date}</span>
          <span className="flex items-center gap-1.5 text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-full border border-cyan-400/20">
            <MapPin size={12} /> {item.location}
          </span>
        </div>

        <p className="text-slate-400 leading-relaxed text-sm font-medium">{item.content}</p>

        {/* ACTIONS BAR */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-white/5">
          <button 
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all uppercase italic tracking-widest active:scale-95"
          >
            <ThumbsUp size={14} /> {likes}
          </button>
          <button 
            onClick={() => setHearts(hearts + 1)}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all uppercase italic tracking-widest active:scale-95"
          >
            <Heart size={14} /> {hearts}
          </button>
          <button 
            onClick={() => setIdeas(ideas + 1)}
            className="flex items-center gap-2 px-4 py-2 text-[10px] font-black rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all uppercase italic tracking-widest active:scale-95"
          >
            <Lightbulb size={14} /> {ideas}
          </button>
          
          <div className="flex-1" />
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`p-3 rounded-xl transition-all border ${showComments ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10'}`}
          >
            <MessageCircle size={18} />
          </button>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-4 pt-4"
            >
              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input 
                  placeholder="DIGITE SEU LOG..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="rounded-xl border-white/10 bg-black/20 text-white focus-visible:ring-emerald-500 text-xs font-bold uppercase tracking-widest"
                />
                <Button size="icon" type="submit" className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black shrink-0">
                  <Send size={16} />
                </Button>
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





// --- COMPONENTE PRINCIPAL ---
export default function SustainableNewsFeed() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {user} =useAuth();
  const[newsfeed, setNewsfeed] =useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showForm, setShowForm] = useState(false);


  const [newNews, setNewNews] = useState({
    title: "",
    summary: "",
    content: "",
    category: "",
    location: ""
});

  useEffect(() => {
  if (isPaused) return;

  const interval = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % newsData.length);
  }, 7000);

  return () => clearInterval(interval);
}, [isPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsData.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  async function handlesalvenewsfeed(updatedNews:NewsItem[]){ 
    if (!user) return;
    
    const {error} =await supabase 
    .from("newsfeed") 
    .upsert({

      }) 
      if (error)alert (error.message); 
    }

  /*Carregar Newsfeed */ 
  useEffect(() => { 
    if (user) loadNewsFeed(user.id); 
  }, [user]); 
  
  async function loadNewsFeed(user_id:string){
     const {data,error}=await supabase 
     .from("newsfeed") 
     .select("*") 
     .eq("user_id",user_id) 
     
     

     if (error){ alert(error.message); 
      return; 
    } 
    if (data && Array.isArray(data)) {
    setNewsfeed(data);
    }
   }
   
  /*para publicar */
  async function handlePublish() {
    if (!user) return;

    const { error } = await supabase.from("newsfeed").insert({
      user_id: user.id,
      title: newNews.title,
      summary: newNews.summary,
      content: newNews.content,
      category: newNews.category,
      location: newNews.location,
      author: user.email, // ou nome
      date: new Date().toISOString(),
    
      gradient: "from-emerald-500 to-green-600"
    });

    if (error) {
      alert(error.message);
      return;
    }

    // limpa form
    setNewNews({
      title: "",
      summary: "",
      content: "",
      category: "",
      location: ""
    });

    // recarrega feed
    loadNewsFeed(user.id);
  }

  
  const filteredNews = newsfeed.filter((item) => {
  const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
  const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
  return matchesSearch && matchesCategory;


});


  return (


    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>
       {/* 🔥 CARROSSEL */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div
          className="relative h-[320px] rounded-[2.5rem] overflow-hidden group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >

      {/* SLIDE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={newsData[currentIndex].id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-to-br ${newsData[currentIndex].gradient}`}
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-black/50" />

          {/* conteúdo */}
          <div className="absolute bottom-0 p-10 space-y-3 max-w-2xl">
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest">
              {newsData[currentIndex].category}
            </span>

            <h2 className="text-4xl font-black text-white leading-tight">
              {newsData[currentIndex].title}
            </h2>

            <p className="text-white/80 text-sm">
              {newsData[currentIndex].summary}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* BOTÃO ESQUERDA */}
      <button
        onClick={() =>
          setCurrentIndex((prev) =>
            prev === 0 ? newsData.length - 1 : prev - 1
          )
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        ◀
      </button>

      {/* BOTÃO DIREITA */}
      <button
        onClick={() =>
          setCurrentIndex((prev) =>
            (prev + 1) % newsData.length
          )
        }
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition"
      >
        ▶
      </button>

      {/* INDICADORES */}
      <div className="absolute bottom-5 right-6 flex gap-2">
        {newsData.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full cursor-pointer transition-all ${
              index === currentIndex
                ? "w-6 bg-emerald-400"
                : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  </div>

      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#020617]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setSelectedCategory(null)}>
            <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
              <Leaf size={24} className="text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Eco'S <span className="text-emerald-500">FEED+</span></h1>
              <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em]">Broadcast Sustentável</p>
            </div>
          </div>

          <div className="relative w-80 hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50" size={16} />
            <Input
              placeholder="PESQUISAR DATABASE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 rounded-xl border-white/10 bg-white/5 focus-visible:ring-emerald-500 text-xs font-black tracking-widest text-white uppercase placeholder:text-slate-600"
            />
          </div>

          <Button
            onClick={() => setShowForm(true)}
            className="bg-emerald-500 text-black font-bold uppercase text-xs"
            >
                + Publicar Notícia
            </Button>
        </div>
        
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 py-10">
        {/* SIDEBAR */}
        <aside className="hidden lg:block col-span-1">
          <div className="sticky top-32 space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 space-y-4 shadow-xl">
              <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Activity size={14} /> Filtros de Campo
              </h2>
              <div className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = selectedCategory === item.label;
                  return (
                    <button 
                      key={item.label} 
                      onClick={() => setSelectedCategory(isActive ? null : item.label)}
                      className={`flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border
                      ${isActive 
                        ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg shadow-emerald-500/20 italic' 
                        : `text-slate-400 border-transparent hover:border-white/10 ${item.bg}`}`}
                    >
                      <Icon size={18} className={isActive ? 'text-black' : item.color} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <AnimatePresence>
  {showForm && (
    <>
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={() => setShowForm(false)}
      />

      {/* MODAL */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ duration: 0.3 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
        w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 
        border border-white/10 rounded-[2rem] p-8 z-50 shadow-2xl"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white">
            ✨ Criar Notícia
          </h2>

          <button
            onClick={() => setShowForm(false)}
            className="text-white/60 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          {/* GRID TOP */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Título"
              value={newNews.title}
              onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
              className="bg-black/30 border-white/10 text-white"
            />

            <Input
              placeholder="Categoria"
              value={newNews.category}
              onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}
              className="bg-black/30 border-white/10 text-white"
            />
          </div>

          <Input
            placeholder="Resumo"
            value={newNews.summary}
            onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
            className="bg-black/30 border-white/10 text-white"
          />

          <Input
            placeholder="Localização"
            value={newNews.location}
            onChange={(e) => setNewNews({ ...newNews, location: e.target.value })}
            className="bg-black/30 border-white/10 text-white"
          />

          <textarea
            placeholder="Conteúdo completo..."
            className="w-full p-4 rounded-2xl bg-black/30 text-white border border-white/10 min-h-[120px]"
            value={newNews.content}
            onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
          />

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="border-white/10 text-white"
            >
              Cancelar
            </Button>

            <Button
              onClick={handlePublish}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6"
            >
              Publicar 🚀
            </Button>
          </div>

        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
    
        {/* FEED */}
        <main className="col-span-1 lg:col-span-3 space-y-10">
          <AnimatePresence mode="popLayout">
            {filteredNews.map((item) => (
              <motion.div 
                key={item.id} 
                layout
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
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
    </div>
  );
}