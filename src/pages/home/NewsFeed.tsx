import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp, Heart, Lightbulb, MessageCircle, Share2, Send,
  Zap, CloudRain, Landmark, Sparkles, TreePine, MapPin, Search, Leaf
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


// Tema visual sustentável:
// - Gradientes verdes suaves
// - Tons terrosos
// - Sombras leves e orgânicas
// - Elementos arredondados (2xl)

export default function SustainableNewsFeed() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-100 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2 rounded-2xl shadow-md">
              <Leaf size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-800">EcoSphere</h1>
              <p className="text-xs text-emerald-600">Notícias para um futuro sustentável</p>
            </div>
          </div>

          <div className="relative w-72 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" size={16} />
            <Input
              placeholder="Buscar notícias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full border-emerald-200 focus-visible:ring-emerald-500"
            />
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-6 py-8">
        {/* Sidebar */}
        <aside className="hidden lg:block col-span-1">
          <Card className="rounded-2xl border-emerald-100 shadow-sm">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Categorias</h2>

              {[
                { label: "Energia", icon: Zap },
                { label: "Clima", icon: CloudRain },
                { label: "Políticas", icon: Landmark },
                { label: "Inovação", icon: Lightbulb },
                { label: "Conservação", icon: TreePine },
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition"
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Sustainability Score */}
          <Card className="mt-6 rounded-2xl border-emerald-100 shadow-sm bg-emerald-600 text-white">
            <CardContent className="p-5 space-y-2">
              <h3 className="text-sm font-semibold">Impacto Positivo</h3>
              <p className="text-3xl font-bold">+32%</p>
              <p className="text-xs text-emerald-100">Crescimento em ações sustentáveis este mês</p>
            </CardContent>
          </Card>
        </aside>

        {/* Feed */}
        <main className="col-span-1 lg:col-span-3 space-y-6">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="rounded-2xl overflow-hidden border-emerald-100 shadow-sm hover:shadow-lg transition-all">
                {/* Image */}
                <div className="h-56 bg-gradient-to-r from-emerald-400 to-green-500 relative">
                  <Badge className="absolute top-4 left-4 bg-white text-emerald-700 rounded-full px-3">
                    Sustentabilidade
                  </Badge>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-emerald-900 leading-tight">
                      Brasil avança em energia limpa e reduz emissões
                    </h3>
                    <p className="text-sm text-emerald-700 mt-1">
                      País registra crescimento recorde em geração renovável e redução de carbono.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-emerald-600">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-bold">
                        ES
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">EcoSphere</span>
                    <span>•</span>
                    <span>02 Mar 2026</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      Brasil
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    O país atingiu metas importantes no setor energético, ampliando investimentos em energia solar e eólica.
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-emerald-100">
                    {[ThumbsUp, Heart, Lightbulb].map((Icon, i) => (
                      <button
                        key={i}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                      >
                        <Icon size={14} />
                        120
                      </button>
                    ))}
                    <div className="flex-1" />
                    <button className="p-2 rounded-full hover:bg-emerald-50 transition">
                      <MessageCircle size={16} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-emerald-50 transition">
                      <Share2 size={16} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </main>
      </div>
    </div>
  );
}
