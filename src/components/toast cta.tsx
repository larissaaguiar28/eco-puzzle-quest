import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";


// --- COMPONENTE TOAST ---
export function Toast({ message }: { message: string }) {
  const [type, setType] = useState<"success" | "error" | "info">("info");

  useEffect(() => {
    if (message) {
      const msg = message.toLowerCase();
      if (msg.includes("sucesso") || msg.includes("bem-vindo") || msg.includes("cadastrado")) {
        setType("success");
      } else if (msg.includes("erro") || msg.includes("falha") || msg.includes("obrigatório") || msg.includes("ruim") || msg.includes("tarde")) {
        setType("error");
      } else {
        setType("info");
      }
    }
  }, [message]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "50%" }}
          animate={{ opacity: 1, y: 0, x: "50%" }}
          exit={{ opacity: 0, y: -20, x: "50%" }}
          className="fixed top-9 left-2/3 z-[99999] w-[21%]"
        >
          <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
            type === "success" ? "bg-emerald-500/90 border-emerald-400 text-white" :
            type === "error" ? "bg-red-500/90 border-red-400 text-white" :
            "bg-blue-500/90 border-blue-400 text-white"
          }`}>
            {type === "success" && <CheckCircle2 className="h-5 w-5 shrink-0" />}
            {type === "error" && <AlertCircle className="h-5 w-5 shrink-0" />}
            {type === "info" && <Info className="h-5 w-5 shrink-0" />}
            <p className="text-sm font-bold tracking-wide">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- HOOK USETOAST ---
export function useToast() {
  const [message, setMessage] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(""); // Limpa antes para triggar a animação se for a mesma msg
    setTimeout(() => {
      setMessage(msg);
      timerRef.current = setTimeout(() => setMessage(""), 4000);
    }, 10);
  };

  return { message, showToast };
}