import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Flame, Thermometer, UserPlus, Clock, AlertTriangle,
  ChevronLeft, ChevronRight, Sprout, Leaf, ShieldCheck
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  id: string;
  color: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Impactos Ambientais", id: "hero", color: "from-emerald-400 to-emerald-600" },
  { icon: Flame, label: "Escassez", id: "scarcity", color: "from-orange-500 to-red-600" },
  { icon: Sprout, label: "Boas Práticas", id: "practices", color: "from-green-500 to-teal-600" },
  { icon: Thermometer, label: "Mudanças Climáticas", id: "climate", color: "from-blue-500 to-indigo-600" },
  { icon: Clock, label: "Linha do Tempo", id: "timeline", color: "from-purple-500 to-fuchsia-600" },
  { icon: AlertTriangle, label: "Contradições", id: "contradictions", color: "from-yellow-500 to-amber-600" },
  { icon: UserPlus, label: "Cadastro", id: "cta", color: "from-cyan-500 to-blue-600" },
];

export function AppSidebar(): JSX.Element {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

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

  const scrollTo = (id: string): void => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 84 : 280 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      className="fixed left-0 top-0 z-50 h-screen bg-zinc-950 border-r border-white/5 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)]"
    >
      {/* HEADER */}
      <div className="flex h-24 items-center justify-between px-6 border-b border-white/5">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="bg-emerald-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(5,150,105,0.4)]">
                <Leaf className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                Eco<span className="text-emerald-500">S</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5 transition-all"
        >
          {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </button>
      </div>

      {/* NAVEGAÇÃO */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`
                group relative flex w-full items-center gap-4 rounded-xl px-4 py-4 transition-all duration-300
                ${isActive ? "bg-zinc-900 shadow-md" : "hover:bg-zinc-900/50"}
              `}
            >
              {/* Barra indicadora lateral */}
              {isActive && (
                <motion.div
                  layoutId="active-bar"
                  className={`absolute left-0 w-1.5 h-8 rounded-r-full bg-gradient-to-b ${item.color}`}
                />
              )}

              {/* Ícone Único */}
              <div className={`
                p-2 rounded-lg transition-all duration-300 flex items-center justify-center
                ${isActive 
                  ? `bg-gradient-to-br ${item.color} text-zinc-950 scale-110 shadow-lg` 
                  : "text-zinc-500 group-hover:text-zinc-300"}
              `}>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              {/* Label */}
              {!collapsed && (
                <span className={`
                  text-sm font-bold tracking-wide transition-colors duration-300
                  ${isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}
                `}>
                  {item.label}
                </span>
              )}

              {/* Tooltip Lateral */}
              {collapsed && (
                <div className="absolute left-20 hidden group-hover:flex items-center">
                   <div className="w-2 h-2 bg-zinc-800 rotate-45 -mr-1" />
                   <div className="bg-zinc-800 text-white text-[12px] font-bold px-3 py-2 rounded-lg shadow-2xl border border-white/10 whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-white/5">
        <div className={`
          flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/5
          ${collapsed ? "justify-center" : ""}
        `}>
          <ShieldCheck className={`h-5 w-5 ${activeSection === 'hero' ? 'text-emerald-500' : 'text-zinc-600'}`} />
          {!collapsed && (
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Protocolo</span>
              <span className="text-[11px] text-zinc-300 font-bold">100% Seguro</span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}