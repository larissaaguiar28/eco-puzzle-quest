import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home, Newspaper, Bot, Gamepad2, UserCircle, Leaf, ChevronLeft, ChevronRight, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Página Inicial", path: "/home" },
  { icon: Newspaper, label: "Feed de Notícias", path: "/home/feed" },
  { icon: Bot, label: "Chatbot", path: "/home/chatbot" },
  { icon: Gamepad2, label: "Jogos", path: "/home/games" },
  { icon: UserCircle, label: "Meu Perfil", path: "/home/profile" },
];

export function HomeSidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="bg-primary p-1.5 rounded-lg">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-sidebar-foreground tracking-tight">
                Eco<span className="text-gold">S</span>
              </span>
              <span className="text-[10px] text-sidebar-foreground/60">Ecoando Sustentabilidade</span>
            </div>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="home-active"
                  className="absolute left-0 w-1 h-6 rounded-r-full bg-gold"
                />
              )}
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {collapsed && (
                <div className="absolute left-16 hidden group-hover:flex items-center z-50">
                  <div className="w-2 h-2 bg-sidebar-accent rotate-45 -mr-1" />
                  <div className="bg-sidebar-accent text-sidebar-accent-foreground text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <NavLink
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Voltar à Landing</span>}
        </NavLink>
      </div>
    </motion.aside>
  );
}
