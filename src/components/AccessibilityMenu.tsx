import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings2, Volume2, ZoomIn, ZoomOut, Eye, X, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ColorblindMode = "none" | "protanopia" | "deuteranopia" | "tritanopia";

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [colorblind, setColorblind] = useState<ColorblindMode>("none");

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

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
      window.speechSynthesis.cancel(); // Para falas anteriores
      const utterance = new SpeechSynthesisUtterance(selection);
      utterance.lang = "pt-BR";
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Filtros SVG para Daltonismo */}
      <svg className="absolute h-0 w-0" aria-hidden="true">
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

      {/* Botão de Ativação */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 right-4 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg hover:bg-primary/90 transition-all active:scale-95"
        aria-label="Menu de acessibilidade"
      >
        <Settings2 className={`h-5 w-5 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="fixed top-16 right-4 z-50 w-72 rounded-xl bg-card p-4 shadow-2xl border border-border"
          >
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="font-bold text-foreground text-sm">Acessibilidade</h3>
              <button onClick={() => setOpen(false)} className="hover:bg-accent p-1 rounded">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Leitura de Texto */}
              <div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block tracking-wider">Voz</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={speakSelected}
                  className="w-full flex gap-2 justify-start"
                >
                  <Volume2 className="h-4 w-4 text-emerald-500" /> Ler texto selecionado
                </Button>
              </div>

              {/* Ajuste de Fonte */}
              <div>
                <div className="flex justify-between items-center mb-2">
                   <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Zoom: {fontSize}%</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-8 flex-1" onClick={() => setFontSize(Math.max(80, fontSize - 10))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 flex-1" onClick={() => setFontSize(100)}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 flex-1" onClick={() => setFontSize(Math.min(150, fontSize + 10))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Filtros de Daltonismo */}
              <div>
                <span className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block tracking-wider">Daltonismo</span>
                <div className="grid grid-cols-2 gap-2">
                  {(["none", "protanopia", "deuteranopia", "tritanopia"] as const).map((mode) => (
                    <Button
                      key={mode}
                      variant={colorblind === mode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setColorblind(mode)}
                      className="text-[10px] h-8"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      {mode === "none" ? "Normal" : mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}