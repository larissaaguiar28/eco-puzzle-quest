import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CTASection() {
  const [formMode, setFormMode] = useState<"login" | "register">("login");

  return (
    <section id="cta" className="section-height bg-card py-16 flex items-center">
      <div className="mx-auto max-w-md px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-extrabold text-foreground mb-2 text-center"
        >
          Junte-se ao Movimento
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-center mb-8"
        >
          Crie sua conta e faça parte da mudança.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="shadow rounded-xl bg-background p-8 border border-border"
        >
          <div className="row mb-6 gap-2 justify-center">
            <Button
              variant={formMode === "login" ? "default" : "ghost"}
              onClick={() => setFormMode("login")}
              className="row gap-1"
            >
              <LogIn className="h-4 w-4" /> Entrar
            </Button>
            <Button
              variant={formMode === "register" ? "default" : "ghost"}
              onClick={() => setFormMode("register")}
              className="row gap-1"
            >
              <UserPlus className="h-4 w-4" /> Registrar
            </Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={formMode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {formMode === "register" && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-foreground">Nome</label>
                  <Input placeholder="Seu nome completo" className="mt-1" />
                </div>
              )}
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input type="email" placeholder="seu@email.com" className="mt-1" />
              </div>
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground">Senha</label>
                <Input type="password" placeholder="••••••••" className="mt-1" />
              </div>
              <Button className="w-full shadow" size="lg">
                {formMode === "login" ? "Entrar na Plataforma" : "Criar Conta"}
              </Button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
