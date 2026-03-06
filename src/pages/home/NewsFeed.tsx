import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp, Heart, Lightbulb, MessageCircle, Share2,
  CloudRain, Landmark, TreePine, MapPin, Search, Leaf, Sun, LucideIcon, Send
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// --- INTERFACES ---
interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  date: string;
  location: string;
  likes: number;
  gradient: string;
}

interface SidebarItem {
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

// --- DADOS ---
// Ajustei as categorias para baterem exatamente com os nomes da Sidebar
const newsData: NewsItem[] = [
  {
    id: 1,
    title: "Brasil bate recorde histórico em geração de energia solar e eólica",
    summary: "O país alcançou a marca de 90% da matriz elétrica renovável neste mês, impulsionando a economia verde.",
    content: "Com novos parques eólicos no Nordeste e fazendas solares no Sudeste, o Brasil não apenas reduziu suas emissões de carbono em 15% no último trimestre, mas também gerou mais de 50 mil novos empregos diretos no setor.",
    category: "Energia Solar",
    author: "EcoS",
    date: "05 Mar 2026",
    location: "Nordeste, BR",
    likes: 342,
    gradient: "from-yellow-400 via-amber-400 to-orange-500" 
  },
  {
    id: 2,
    title: "Startup desenvolve bioplástico a partir de algas marinhas",
    summary: "Nova embalagem 100% biodegradável se dissolve na água em semanas e já atrai gigantes do varejo.",
    content: "Pesquisadores em parceria com uma startup de biotecnologia criaram um material revolucionário que substitui o plástico de uso único. Feito de sargaço e resíduos da indústria pesqueira.",
    category: "Inovação",
    author: "EcoS",
    date: "04 Mar 2026",
    location: "Rio de Janeiro, BR",
    likes: 289,
    gradient: "from-cyan-400 to-teal-500" 
  },
  {
    id: 3,
    title: "Hortas urbanas verticais transformam telhados em São Paulo",
    summary: "Projeto de agricultura urbana reduz a temperatura dos prédios e fornece alimentos frescos para a comunidade.",
    content: "Uma iniciativa comunitária mapeou e transformou mais de 200 telhados ociosos no centro da capital paulista em fazendas urbanas produtivas. Além de mitigar as ilhas de calor.",
    category: "Conservação",
    author: "EcoS",
    date: "02 Mar 2026",
    location: "São Paulo, BR",
    likes: 512,
    gradient: "from-lime-400 to-green-500" 
  }
];

const sidebarItems: SidebarItem[] = [
  { label: "Energia Solar", icon: Sun, color: "text-amber-500", bg: "hover:bg-amber-50" },
  { label: "Clima", icon: CloudRain, color: "text-cyan-500", bg: "hover:bg-cyan-50" },
  { label: "Políticas", icon: Landmark, color: "text-indigo-500", bg: "hover:bg-indigo-50" },
  { label: "Inovação", icon: Lightbulb, color: "text-yellow-500", bg: "hover:bg-yellow-50" },
  { label: "Conservação", icon: TreePine, color: "text-green-500", bg: "hover:bg-green-50" },
];

// --- COMPONENTE DE NOTÍCIA INDIVIDUAL ---
const NewsCard = ({ item }: { item: NewsItem }) => {
  const [likes, setLikes] = useState(item.likes);
  const [hearts, setHearts] = useState(Math.floor(item.likes / 3));
  const [ideas, setIdeas] = useState(Math.floor(item.likes / 5));
  
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<{id: number, text: string}[]>([]);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now(), text: newComment }]);
      setNewComment("");
    }
  };

  return (
    <Card className="rounded-3xl overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
      <div className={`h-48 bg-gradient-to-r ${item.gradient} relative`}>
        <Badge className="absolute top-4 left-4 bg-white/90 text-teal-900 rounded-full px-4 py-1 font-bold shadow-sm backdrop-blur-md border-none">
          {item.category}
        </Badge>
      </div>

      <CardContent className="p-8 space-y-5">
        <div>
          <h3 className="text-2xl font-extrabold text-gray-800 leading-tight hover:text-teal-600 transition-colors cursor-pointer">
            {item.title}
          </h3>
          <p className="text-base font-medium text-teal-600 mt-2">{item.summary}</p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-2 ring-teal-100">
              <AvatarFallback className="bg-teal-100 text-teal-800 text-xs font-extrabold">
                {item.author.substring(0,2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-700">{item.author}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span>{item.date}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span className="flex items-center gap-1 text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
            <MapPin size={14} /> {item.location}
          </span>
        </div>

        <p className="text-gray-600 leading-relaxed text-sm">{item.content}</p>

        <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
          <button 
            onClick={() => setLikes(likes + 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-transform active:scale-90"
          >
            <ThumbsUp size={16} /> {likes}
          </button>
          <button 
            onClick={() => setHearts(hearts + 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-transform active:scale-90"
          >
            <Heart size={16} /> {hearts}
          </button>
          <button 
            onClick={() => setIdeas(ideas + 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-transform active:scale-90"
          >
            <Lightbulb size={16} /> {ideas}
          </button>
          
          <div className="flex-1" />
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`p-2.5 rounded-full transition-colors ${showComments ? 'bg-teal-100 text-teal-600' : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50'}`}
          >
            <MessageCircle size={20} />
          </button>
          <button className="p-2.5 rounded-full text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors">
            <Share2 size={20} />
          </button>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-gray-50"
            >
              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input 
                  placeholder="Deixe um comentário positivo..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="rounded-full border-teal-100 focus-visible:ring-teal-500 text-sm"
                />
                <Button size="icon" type="submit" className="rounded-full bg-teal-600 hover:bg-teal-700 shrink-0">
                  <Send size={16} />
                </Button>
              </form>
              
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {comments.map((c) => (
                  <div key={c.id} className="bg-gray-50 p-3 rounded-2xl text-xs text-gray-700 border border-gray-100">
                    <span className="font-bold text-teal-700">Você: </span>{c.text}
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
  // Estado para a categoria ativa
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filtro que une a busca por texto + a categoria clicada na sidebar
  const filteredNews = newsData.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-green-50 to-yellow-50 text-foreground">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-green-200">
        <div className="max-w-9xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedCategory(null)}>
            <div className="bg-gradient-to-tr from-green-500 to-teal-400 text-white p-2.5 rounded-2xl shadow-lg shadow-green-200">
              <Leaf size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-green-600">Eco'S</h1>
              <p className="text-xs font-medium text-teal-600">Notícias para um futuro brilhante</p>
            </div>
          </div>

          <div className="relative w-72 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-400" size={16} />
            <Input
              placeholder="Buscar boas notícias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full border-teal-200 bg-white/80 focus-visible:ring-teal-500 shadow-sm"
            />
          </div>
        </div>
      </header>

      <div className="max-w-9xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 py-8">
        <aside className="hidden lg:block col-span-1">
          <Card className="rounded-3xl border-none shadow-sm bg-white/80 backdrop-blur-sm sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-sm font-bold text-teal-800 uppercase tracking-wider">Explorar</h2>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = selectedCategory === item.label;
                return (
                  <button 
                    key={item.label} 
                    onClick={() => setSelectedCategory(isActive ? null : item.label)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 
                    ${isActive ? 'bg-teal-100 text-teal-800 shadow-inner' : `text-gray-700 ${item.bg}`}`}
                  >
                    <Icon size={20} className={item.color} />
                    {item.label}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </aside>

        <main className="col-span-1 lg:col-span-3 space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredNews.map((item) => (
              <motion.div 
                key={item.id} 
                layout // Faz os cards deslizarem suavemente ao filtrar
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <NewsCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredNews.length === 0 && (
            <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-teal-200">
               <p className="text-teal-800 font-medium">Nenhuma notícia encontrada nesta categoria.</p>
               <Button variant="link" onClick={() => setSelectedCategory(null)} className="text-teal-600">Ver todas as notícias</Button>
            </div>
          )}
</main>
      </div>
    </div>
  );
}