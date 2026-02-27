import React from "react";
import { motion } from "framer-motion";
import { Gamepad2, Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Games() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="border-border text-center">
          <CardContent className="p-10 space-y-6">
            <div className="mx-auto bg-accent/10 w-20 h-20 rounded-2xl flex items-center justify-center">
              <Gamepad2 className="h-10 w-10 text-accent" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Jogos Educativos</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Estamos preparando jogos interativos sobre sustentabilidade para você aprender enquanto se diverte!
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg p-3">
              <Construction size={18} />
              <span className="font-medium">Em breve disponível</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
