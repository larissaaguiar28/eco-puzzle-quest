import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp, Heart, Lightbulb, MessageCircle, Share2, Send,
  Zap, CloudRain, Landmark, Sparkles, TreePine, MapPin, Search, ImageIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Category = "all" | "energia" | "clima" | "politicas" | "inovacao" | "conservacao";

interface Reaction {
  type: string;
  icon: React.ElementType;
  label: string;
  count: number;
  active: boolean;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

interface NewsItem {
  id: number;
  title: string;
  subtitle: string;
  summary: string;
  date: string;
  location: string;
  category: Category;
  reactions: Reaction[];
  comments: Comment[];
}

const categories: { id: Category; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "Todas", icon: Sparkles },
  { id: "energia", label: "Energia Renovável", icon: Zap },
  { id: "clima", label: "Mudanças Climáticas", icon: CloudRain },
  { id: "politicas", label: "Políticas Ambientais", icon: Landmark },
  { id: "inovacao", label: "Inovação Sustentável", icon: Lightbulb },
  { id: "conservacao", label: "Conservação Ambiental", icon: TreePine },
];

const makeReactions = (l: number, h: number, i: number): Reaction[] => [
  { type: "like", icon: ThumbsUp, label: "Curtir", count: l, active: false },
  { type: "love", icon: Heart, label: "Apoiar", count: h, active: false },
  { type: "insightful", icon: Lightbulb, label: "Interessante", count: i, active: false },
];

const initialNews: NewsItem[] = [
  {
    id: 1,
    title: "Brasil ultrapassa 200 GW de capacidade em energia solar",
    subtitle: "País consolida liderança na América Latina em geração fotovoltaica",
    summary: "O país atingiu um marco histórico ao superar 200 gigawatts de capacidade instalada em energia solar fotovoltaica, consolidando-se como líder na América Latina em geração de energia limpa.",
    date: "27 de fevereiro de 2026",
    location: "Brasília, DF",
    category: "energia",
    reactions: makeReactions(142, 87, 54),
    comments: [
      { id: 1, author: "Carlos M.", text: "Incrível avanço! O Brasil tem um potencial enorme.", date: "27/02/2026" },
    ],
  },
  {
    id: 2,
    title: "ONU alerta: 2025 foi o ano mais quente da história",
    subtitle: "Relatório reforça urgência de ações climáticas globais imediatas",
    summary: "Relatório da Organização das Nações Unidas confirma que 2025 bateu todos os recordes de temperatura média global, reforçando a urgência de ações climáticas imediatas.",
    date: "25 de fevereiro de 2026",
    location: "Genebra, Suíça",
    category: "clima",
    reactions: makeReactions(230, 45, 198),
    comments: [],
  },
  {
    id: 3,
    title: "Nova lei proíbe microplásticos em cosméticos no Brasil",
    subtitle: "Legislação protege ecossistemas aquáticos a partir de 2027",
    summary: "Legislação aprovada pelo Congresso Nacional proíbe o uso de microplásticos em produtos cosméticos e de higiene pessoal a partir de 2027, protegendo ecossistemas aquáticos.",
    date: "23 de fevereiro de 2026",
    location: "Brasília, DF",
    category: "politicas",
    reactions: makeReactions(312, 156, 89),
    comments: [
      { id: 1, author: "Julia F.", text: "Finalmente! Já era hora de banir esses poluentes.", date: "23/02/2026" },
      { id: 2, author: "Ricardo P.", text: "Ótima notícia para nossos rios e oceanos.", date: "24/02/2026" },
    ],
  },
  {
    id: 4,
    title: "Startup brasileira cria embalagem 100% compostável a partir de algas",
    subtitle: "Biotecnologia nacional substitui plásticos convencionais em larga escala",
    summary: "Empresa de biotecnologia desenvolveu embalagens feitas inteiramente de algas marinhas, que se decompõem em até 60 dias, substituindo plásticos convencionais em larga escala.",
    date: "20 de fevereiro de 2026",
    location: "São Paulo, SP",
    category: "inovacao",
    reactions: makeReactions(445, 267, 178),
    comments: [],
  },
  {
    id: 5,
    title: "Amazônia registra menor taxa de desmatamento em 10 anos",
    subtitle: "Fiscalização intensificada e reflorestamento geram resultados positivos",
    summary: "Dados do INPE mostram que a floresta amazônica teve a menor taxa de desmatamento da última década, resultado de fiscalização intensificada e programas de reflorestamento.",
    date: "18 de fevereiro de 2026",
    location: "Manaus, AM",
    category: "conservacao",
    reactions: makeReactions(523, 341, 112),
    comments: [
      { id: 1, author: "André B.", text: "Que notícia maravilhosa! Continuemos nesse caminho.", date: "18/02/2026" },
    ],
  },
  {
    id: 6,
    title: "Parques eólicos offshore começam a operar no litoral do Nordeste",
    subtitle: "Ceará e Rio Grande do Norte inauguram primeiros parques do país",
    summary: "Os primeiros parques eólicos offshore do Brasil foram inaugurados no litoral do Ceará e Rio Grande do Norte, com capacidade combinada de 3 GW de energia limpa.",
    date: "15 de fevereiro de 2026",
    location: "Fortaleza, CE",
    category: "energia",
    reactions: makeReactions(189, 94, 67),
    comments: [],
  },
];

export default function NewsFeed() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [commentTexts, setCommentTexts] = useState<Record<number, string>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let items = activeCategory === "all" ? news : news.filter((n) => n.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.subtitle.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q)
      );
    }
    return items;
  }, [news, activeCategory, searchQuery]);

  const toggleReaction = (newsId: number, reactionType: string) => {
    setNews((prev) =>
      prev.map((n) =>
        n.id === newsId
          ? {
              ...n,
              reactions: n.reactions.map((r) =>
                r.type === reactionType
                  ? { ...r, active: !r.active, count: r.active ? r.count - 1 : r.count + 1 }
                  : r
              ),
            }
          : n
      )
    );
  };

  const addComment = (newsId: number) => {
    const text = commentTexts[newsId]?.trim();
    if (!text) return;
    setNews((prev) =>
      prev.map((n) =>
        n.id === newsId
          ? {
              ...n,
              comments: [...n.comments, { id: Date.now(), author: "Você", text, date: "02/03/2026" }],
            }
          : n
      )
    );
    setCommentTexts((prev) => ({ ...prev, [newsId]: "" }));
  };

  return (
    <div className="flex min-h-screen">
      {/* Category Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border bg-card p-5 sticky top-0 h-screen overflow-y-auto hidden lg:block">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Categorias</h2>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <cat.icon size={18} />
              {cat.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Feed */}
      <div className="flex-1 max-w-3xl mx-auto p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Feed de Notícias</h1>
          <Badge variant="outline" className="text-xs">{filtered.length} notícias</Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Buscar por palavras-chave..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Mobile category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "text-muted-foreground border-border hover:border-primary/30"
              )}
            >
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="border-border overflow-hidden">
                {/* Image placeholder */}
                <div className="relative h-[200px] bg-muted flex items-center justify-center">
                  <ImageIcon className="text-muted-foreground/40" size={48} />
                  <Badge className="absolute top-3 right-3 text-[10px]">
                    {categories.find((c) => c.id === item.category)?.label}
                  </Badge>
                </div>

                <CardContent className="p-5 space-y-3">
                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground leading-tight">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.subtitle}</p>
                  </div>

                  {/* Author + Date + Location */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">ES</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-foreground">Eco'S</span>
                    <span>•</span>
                    <span>{item.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {item.location}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.summary}</p>

                  {/* Reactions */}
                  <div className="flex items-center gap-1 border-t border-border pt-3">
                    {item.reactions.map((r) => (
                      <button
                        key={r.type}
                        onClick={() => toggleReaction(item.id, r.type)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                          r.active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <r.icon size={15} fill={r.active ? "currentColor" : "none"} />
                        {r.count}
                      </button>
                    ))}
                    <div className="flex-1" />
                    <button
                      onClick={() => setOpenComments(openComments === item.id ? null : item.id)}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <MessageCircle size={15} />
                      {item.comments.length}
                    </button>
                    <button className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                      <Share2 size={15} />
                    </button>
                  </div>

                  {/* Comments */}
                  <AnimatePresence>
                    {openComments === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-border pt-3 space-y-3"
                      >
                        {item.comments.map((c) => (
                          <div key={c.id} className="flex gap-3">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold">
                                {c.author[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-foreground">{c.author}</span>
                                <span className="text-[10px] text-muted-foreground">{c.date}</span>
                              </div>
                              <p className="text-xs text-foreground mt-1">{c.text}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Escreva um comentário..."
                            value={commentTexts[item.id] || ""}
                            onChange={(e) => setCommentTexts((p) => ({ ...p, [item.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && addComment(item.id)}
                            className="text-xs h-9"
                          />
                          <Button size="sm" className="h-9 px-3" onClick={() => addComment(item.id)}>
                            <Send size={14} />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
