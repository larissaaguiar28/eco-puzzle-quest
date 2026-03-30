import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence, color } from "framer-motion";
import {
  Home, Newspaper, Bot, Gamepad2, UserCircle, Leaf,
  ChevronLeft, ChevronRight, LogOut, ShieldCheck,
  FileText
} from "lucide-react";

// Definição interna do 'cn' caso você não tenha o arquivo utils
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

const navItems = [
  { icon: Home, label: "Página Inicial", path: "/home", color: "from-emerald-400 to-emerald-600" },
  { icon: Newspaper, label: "Feed de Notícias", path: "/home/feed", color: "from-blue-500 to-indigo-600" },
  { icon: Bot, label: "Chatbot", path: "/home/chatbot", color: "from-purple-500 to-fuchsia-600" },
  { icon: Gamepad2, label: "Jogos", path: "/home/games", color: "from-orange-500 to-red-600" },
  { icon: FileText, label: "Denúncias", path: "/home/report", color: "from-red-500 to-blue-600"},
  { icon: UserCircle, label: "Meu Perfil", path: "/home/profile", color: "from-cyan-500 to-blue-600" },
];

export function HomeSidebar() {
  const [collapsed, setCollapsed] = useState(false);

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
              key="logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
            >
              <div className="bg-emerald-600 p-1.5 rounded-lg shrink-0">
                <Leaf className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">
                  Eco<span className="text-emerald-500">S</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                  Ecoando Sustentabilidade
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5 transition-all"
        >
          {collapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </button>
      </div>

      {/* NAVEGAÇÃO */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "group relative flex w-full items-center gap-4 rounded-xl px-4 py-4 transition-all duration-300",
              isActive ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="active-bar-home"
                    className={cn("absolute left-0 w-1.5 h-8 rounded-r-full bg-gradient-to-b", item.color)}
                  />
                )}

                <div className={cn(
                  "p-2 rounded-lg transition-all duration-300 flex items-center justify-center shrink-0",
                  isActive ? `bg-gradient-to-br text-zinc-950 scale-110 ${item.color}` : "text-inherit"
                )}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>

                {!collapsed && (
                  <span className="text-sm font-bold tracking-wide transition-colors duration-300 whitespace-nowrap">
                    {item.label}
                  </span>
                )}

                {collapsed && (
                  <div className="absolute left-20 hidden group-hover:flex items-center z-[60]">
                    <div className="w-2 h-2 bg-zinc-800 rotate-45 -mr-1" />
                    <div className="bg-zinc-800 text-white text-[12px] font-bold px-3 py-2 rounded-lg shadow-2xl border border-white/10 whitespace-nowrap">
                      {item.label}
                    </div>
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <NavLink
          to="/"
          className="group flex items-center gap-4 rounded-xl px-4 py-3 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          <div className="p-2 shrink-0">
            <LogOut size={20} />
          </div>
          {!collapsed && <span className="text-sm font-bold tracking-wide whitespace-nowrap">Sair</span>}
        </NavLink>

        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/5",
          collapsed ? "justify-center" : ""
        )}>
          <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
          {!collapsed && (
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Acesso</span>
              <span className="text-[11px] text-zinc-300 font-bold whitespace-nowrap">100% Seguro</span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}