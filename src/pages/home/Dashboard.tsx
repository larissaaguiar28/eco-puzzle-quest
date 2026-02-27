import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Newspaper, Bot, Gamepad2, UserCircle, TrendingUp, Leaf, Droplets, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const quickLinks = [
  { icon: Newspaper, label: "Feed de Notícias", desc: "Últimas notícias sobre sustentabilidade", path: "/home/feed", color: "bg-primary" },
  { icon: Bot, label: "Chatbot", desc: "Converse sobre meio ambiente", path: "/home/chatbot", color: "bg-secondary" },
  { icon: Gamepad2, label: "Jogos", desc: "Aprenda brincando", path: "/home/games", color: "bg-accent" },
  { icon: UserCircle, label: "Meu Perfil", desc: "Personalize sua experiência", path: "/home/profile", color: "bg-forest" },
];

const stats = [
  { icon: Leaf, label: "Árvores Plantadas", value: "12.4M", change: "+8.2%" },
  { icon: Droplets, label: "Água Economizada", value: "340B L", change: "+12.5%" },
  { icon: Wind, label: "CO₂ Reduzido", value: "1.2B ton", change: "+5.7%" },
];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-foreground">
          Bem-vindo ao Eco<span className="text-gold">S</span>
        </h1>
        <p className="text-muted-foreground">Ecoando Sustentabilidade — acompanhe, aprenda e faça a diferença.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-border">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <span className="text-xs font-semibold text-primary flex items-center gap-1">
                  <TrendingUp size={14} /> {stat.change}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, i) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <Link to={link.path}>
                <Card className="border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md cursor-pointer group">
                  <CardContent className="p-5 space-y-3">
                    <div className={`${link.color} p-2.5 rounded-lg w-fit text-primary-foreground group-hover:scale-110 transition-transform`}>
                      <link.icon size={22} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{link.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{link.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <Card className="border-border">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Atividade Recente</h2>
          <div className="space-y-3">
            {["Você completou o quiz sobre Mudanças Climáticas", "Nova notícia: Brasil lidera energia solar na América Latina", "Perfil atualizado com sucesso"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
