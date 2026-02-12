import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home, Flame, Thermometer, UserPlus, Clock, AlertTriangle,
  ChevronLeft, ChevronRight, Sprout,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Impactos Ambientais", id: "hero" },
  { icon: Flame, label: "Escassez", id: "scarcity" },
  { icon: Sprout, label: "Boas Práticas", id: "practices" },
  { icon: Thermometer, label: "Mudanças Climáticas", id: "climate" },
  { icon: Clock, label: "Linha do Tempo", id: "timeline" },
  { icon: AlertTriangle, label: "Contradições", id: "contradictions" },
  { icon: UserPlus, label: "Cadastro", id: "cta" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      for (const item of [...navItems].reverse()) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(item.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 220 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 z-30 flex h-screen flex-col bg-sidebar/95 backdrop-blur-sm border-r border-sidebar-border"
    >
      <div className="flex items-center justify-between p-3">
        {!collapsed && (
          <span className="text-sm font-bold text-sidebar-foreground tracking-wide">
            Eco'S
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </motion.aside>
  );
}
