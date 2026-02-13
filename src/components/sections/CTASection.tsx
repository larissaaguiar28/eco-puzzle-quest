import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Trophy, Gift, Check, Sparkles, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuiz } from "@/contexts/QuizContext";

export function CTASection() {
  const [formMode, setFormMode] = useState<"login" | "register">("login");
  const { isCompleted } = useQuiz();

  const quizSections = [
    "Energias Renováveis", "Escassez & Florestas", "Clima & Saúde",
    "Práticas Sustentáveis", "História Ambiental", "Impactos da Agro",
  ];

  const completedCount = quizSections.filter((_, i) => isCompleted(i)).length;
  const hasWonPrize = completedCount >= 3;

  const handleRedeemClick = () => {
    setFormMode("register");
    document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // BG F1F3EC: O tom bege/creme exato do fundo da sua página superior
    <section id="cta" className="relative py-24 overflow-hidden bg-[#F1F3EC]">
      <div className="relative z-10 mx-auto max-w-6xl px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LADO ESQUERDO: ACESSE O PORTAL (Verde Floresta da sua Sidebar) */}
          <motion.div
            id="auth-form"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-[#0D3B2E] rounded-[2rem] p-10 shadow-xl border border-[#164D3D]"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Acesse o <span className="text-[#4ADE80]">Portal</span>
              </h2>
              <p className="text-slate-300/80 mt-2 text-sm">
                Sua conta para um futuro consciente.
              </p>
            </div>

            {/* Seletores seguindo o padrão da sua sidebar */}
            <div className="inline-flex p-1 bg-[#08281F] rounded-xl mb-8 w-fit border border-[#1a4639]">
              <button 
                onClick={() => setFormMode("login")} 
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                  formMode === "login" ? "bg-white text-[#0D3B2E] shadow-md" : "text-white/60 hover:text-white"
                }`}
              >
                <LogIn className="h-4 w-4" /> ENTRAR
              </button>
              <button 
                onClick={() => setFormMode("register")} 
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                  formMode === "register" ? "bg-white text-[#0D3B2E] shadow-md" : "text-white/60 hover:text-white"
                }`}
              >
                <UserPlus className="h-4 w-4" /> REGISTRAR
              </button>
            </div>

            <div className="space-y-4">
              <Input placeholder="E-mail" className="bg-[#08281F] border-[#1a4639] text-white placeholder:text-gray-500 h-12 rounded-xl focus:ring-[#4ADE80]" />
              <Input type="password" placeholder="Senha" className="bg-[#08281F] border-[#1a4639] text-white placeholder:text-gray-500 h-12 rounded-xl focus:ring-[#4ADE80]" />
              
              <Button className="w-full h-14 bg-[#1DA57A] hover:bg-[#168a65] text-white font-bold rounded-xl mt-4 text-base shadow-lg transition-colors">
                Entrar na Plataforma
              </Button>
            </div>
          </motion.div>

          {/* LADO DIREITO: PROGRESSO E PLANOS */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* CARD PROGRESSO: Verde escuro idêntico ao botão "Responder Quiz" */}
            <motion.div className="bg-[#0D3B2E] rounded-[2rem] p-8 shadow-lg border border-[#164D3D]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-[#164D3D] text-[#4ADE80]">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Progresso Ambiental</h3>
                    <p className="text-sm text-emerald-400/70">{completedCount} de 6 desafios concluídos</p>
                  </div>
                </div>
              </div>
              <div className="h-2.5 w-full bg-[#08281F] rounded-full overflow-hidden">
                <div className="h-full bg-[#1DA57A] rounded-full transition-all duration-1000" style={{ width: `${(completedCount / 6) * 100}%` }} />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* PLANO FREE: Fundo Verde Menta muito sutil para casar com os cards de cima */}
              <div className="bg-[#E8F0E9] rounded-[2rem] p-8 border border-[#D1DFD4] shadow-sm flex flex-col justify-between border-2 border-black">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-2 bg-white rounded-lg text-[#0D3B2E]"><GraduationCap className="h-5 w-5" /></div>
                    <span className="text-[10px] font-bold bg-[#D1DFD4] px-2 py-1 rounded text-[#0D3B2E]">FREE</span>
                  </div>
                  <h4 className="font-bold text-[#0D3B2E] text-lg">Educacional</h4>
                  <p className="text-xs text-[#2D5A4C] mt-2 mb-6 leading-relaxed">Acesso básico para quem está começando sua jornada ecológica.</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-xs font-semibold text-[#0D3B2E]"><Check className="h-4 w-4 text-[#1DA57A]" /> Quizzes Ilimitados</li>
                    <li className="flex items-center gap-2 text-xs font-semibold text-[#0D3B2E]"><Check className="h-4 w-4 text-[#1DA57A]" /> Certificado Simples</li>
                  </ul>
                </div>
                <Button variant="outline" className="w-full mt-8 rounded-xl border-[#0D3B2E]/20 text-[#0D3B2E] font-bold hover:bg-[#0D3B2E] hover:text-white transition-all">SABER MAIS</Button>
              </div>

              {/* PREMIUM: Mantendo o destaque Escuro/Dourado que você gostou */}
              <div className="bg-[#061A14] rounded-[2rem] p-8 border border-white/5 shadow-2xl flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles className="h-12 w-12 text-[#EAB308]" /></div>
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <div className="p-2 bg-[#EAB308]/10 rounded-lg text-[#EAB308]"><Sparkles className="h-5 w-5" /></div>
                  <span className="text-[10px] font-bold bg-[#EAB308] text-black px-2 py-1 rounded">PREMIUM</span>
                </div>
                <h4 className="font-bold text-white text-lg relative z-10">Acesso Completo</h4>
                <p className="text-xs text-slate-400 mt-2 mb-6 relative z-10">Acesso ilimitado a trilhas exclusivas e desafios interativos.</p>
                <ul className="space-y-3 relative z-10">
                  <li className="flex items-center gap-2 text-xs font-semibold text-slate-300"><Check className="h-4 w-4 text-[#EAB308]" /> Suporte 24h</li>
                  <li className="flex items-center gap-2 text-xs font-semibold text-slate-300"><Check className="h-4 w-4 text-[#EAB308]" /> Conteúdo Exclusivo</li>
                </ul>
                <Button className="w-full mt-8 rounded-xl bg-[#EAB308] hover:bg-[#CA8A04] text-black font-bold transition-all shadow-lg shadow-yellow-900/20">VER PLANOS</Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}