import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accessibility, Volume2, ZoomIn, ZoomOut, Eye, Moon, Sun, X
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ColorblindMode = "none" | "protanopia" | "deuteranopia" | "tritanopia";

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [darkMode, setDarkMode] = useState(false);
  const [colorblind, setColorblind] = useState<ColorblindMode>("none");

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.classList.remove(
      "colorblind-protanopia",
      "colorblind-deuteranopia",
      "colorblind-tritanopia"
    );
    if (colorblind !== "none") {
      document.documentElement.classList.add(`colorblind-${colorblind}`);
    }
  }, [colorblind]);

  const speakSelected = () => {
    const selection = window.getSelection()?.toString();
    if (selection && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(selection);
      utterance.lang = "pt-BR";
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* SVG colorblind filters */}
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0" />
          </filter>
        </defs>
      </svg>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 right-4 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        aria-label="Menu de acessibilidade"
      >
        <Accessibility className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed top-16 right-4 z-50 w-72 rounded-xl bg-card p-4 shadow-xl border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground text-sm">Acessibilidade</h3>
              <button onClick={() => setOpen(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Read aloud */}
              <Button
                variant="outline"
                size="sm"
                onClick={speakSelected}
                className="w-full row gap-2 justify-start"
              >
                <Volume2 className="h-4 w-4" /> Ler texto selecionado
              </Button>

              {/* Zoom */}
              <div className="row justify-between">
                <span className="text-xs text-muted-foreground">Zoom: {fontSize}%</span>
                <div className="row gap-1">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setFontSize(Math.max(80, fontSize - 10))}>
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setFontSize(Math.min(150, fontSize + 10))}>
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Colorblind */}
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">Daltonismo</span>
                <div className="grid grid-cols-2 gap-1">
                  {(["none", "protanopia", "deuteranopia", "tritanopia"] as const).map((mode) => (
                    <Button
                      key={mode}
                      variant={colorblind === mode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setColorblind(mode)}
                      className="text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      {mode === "none" ? "Normal" : mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Dark mode */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="w-full row gap-2 justify-start"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {darkMode ? "Modo Claro" : "Modo Noturno"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
