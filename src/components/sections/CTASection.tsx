import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, Trophy, Check, Sparkles, GraduationCap, ArrowRight, Lock, Unlock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuiz } from "@/contexts/QuizContext";
import { Navigate, useNavigate } from "react-router-dom";



export type User = {
  email?: string;
  pass?: string;
}

export function CTASection() {

  const nav = useNavigate();
  const [formMode, setFormMode] = useState<"login" | "register">("login");
  const { isCompleted } = useQuiz();

  const [tentativa, setTentativa] = useState(0);

  const [user, setUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);


  function checkedLogin() { console.log('checkedLogin')
    if (tentativa < 3) {
      setTentativa(tentativa + 1);

    } else {
      alert('volte mais tarde');
      return;
    }

    let loged = users.find(u => u.email == user?.email && u.pass === user?.pass);
    if (loged) {
      alert('Login realizado com sucesso!');
      nav('/home');

    } else {
      alert('Email ou senha invalidos');

    }
  }


    function handleRegister() { console.log('handleRegister')
      if (user?.email && user?.pass) {
        setUsers([...users, user]);
        alert('Email Cadastrado com sucesso!')

      } else {
        alert('Email e senha obrigatório!');
      }

    }

    const quizSections = [
      "Energias Renováveis", "Escassez & Florestas", "Clima & Saúde",
      "Práticas Sustentáveis", "História Ambiental", "Impactos da Agro",
    ];

    const completedCount = quizSections.filter((_, i) => isCompleted(i)).length;
    const progressPercentage = (completedCount / 6) * 100;

    const GOAL_COUNT = 4;
    const isGoalReached = completedCount >= GOAL_COUNT;

    return (
      <section id="cta" className="relative py-24 overflow-hidden bg-[#F1F3EC]">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-emerald-100 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-green-100 rounded-full blur-[120px] opacity-60" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

            {/* LADO ESQUERDO: AUTH CARD */}
            <motion.div
              id="auth-form"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 bg-[#0D3B2E] rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(13,59,46,0.3)] border border-white/10 flex flex-col justify-center"
            >
              <div>
                <div className="mb-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={formMode}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                        {formMode === "login" ? (
                          <>Bem-vindo de <br /><span className="text-[#4ADE80] italic">volta.</span></>
                        ) : (
                          <>Crie sua conta <br /><span className="text-[#4ADE80] italic">agora.</span></>
                        )}
                      </h2>
                      <p className="text-emerald-100/60 mt-4 text-base font-medium">
                        {formMode === "login"
                          ? "Acesse seu painel para continuar evoluindo."
                          : "Comece sua jornada sustentável hoje mesmo."}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Selector */}
                <div className="inline-flex p-1.5 bg-[#08281F] rounded-2xl mb-10 w-full border border-white/5">
                  <button
                    onClick={() => setFormMode("login")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${formMode === "login" ? "bg-[#1DA57A] text-white shadow-lg" : "text-white/40 hover:text-white"
                      }`}
                  >
                    <LogIn className="h-4 w-4" /> ENTRAR
                  </button>
                  <button
                    onClick={() => setFormMode("register")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${formMode === "register" ? "bg-[#1DA57A] text-white shadow-lg" : "text-white/40 hover:text-white"
                      }`}
                  >
                    <UserPlus className="h-4 w-4" /> REGISTRAR
                  </button>
                </div>

                <div className="space-y-4">
                  {/* CAMPO NOME DE USUÁRIO (Apenas no registro) */}
                  <AnimatePresence>
                    {formMode === "register" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <label className="text-xs font-bold text-emerald-400/80 ml-2 uppercase tracking-widest">Nome de Usuário</label>
                        <Input
                          placeholder="Como quer ser chamado?"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-14 rounded-2xl focus:ring-[#4ADE80] transition-all"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-emerald-400/80 ml-2 uppercase tracking-widest">E-mail</label>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-14 rounded-2xl focus:ring-[#4ADE80] transition-all"

                      onChange={(e) => setUser(
                        {
                          ...user, email: e.target.value
                        }

                      )}



                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-emerald-400/80 ml-2 uppercase tracking-widest">Senha</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 h-14 rounded-2xl focus:ring-[#4ADE80] transition-all"
                      onChange={(e) => setUser(
                        {
                          ...user, pass: e.target.value
                        }
                      )}

                    />
                  </div>

                  <Button className="w-full h-14 bg-[#4ADE80] hover:bg-[#3ecb72] text-[#0D3B2E] font-black rounded-2xl mt-6 text-base uppercase tracking-wider shadow-[0_10px_20px_rgba(74,222,128,0.2)] transition-transform active:scale-95"
                    onClick={() => { 
                        console.log ('click')
                        formMode === "login" ? checkedLogin(): handleRegister();
                      }}
                  >
                    {formMode === "login" ? "Acessar Portal" : "Cadastrar Agora"}
                    <ArrowRight className="ml-2 h-5 w-5" />

                  </Button>
                </div>
              </div>
            </motion.div>

            {/* LADO DIREITO: PROGRESSO E RECOMPENSA */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-emerald-100/50"
              >
                <div className="flex justify-between items-end mb-6">
                  <div className="flex items-center gap-5">
                    <div className="p-4 rounded-2xl bg-[#F1F3EC] text-[#0D3B2E]">
                      <Trophy className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0D3B2E] text-xl">Seu Impacto</h3>
                      <p className="text-sm font-medium text-emerald-600/70">Você completou {completedCount} de 6 módulos</p>
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#0D3B2E]">{Math.round(progressPercentage)}%</span>
                </div>

                <div className="h-4 w-full bg-[#F1F3EC] rounded-full overflow-hidden p-1 mb-8">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-[#1DA57A] to-[#4ADE80] rounded-full"
                  />
                </div>

                <motion.div
                  animate={isGoalReached ? { scale: [1, 1.01, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Button
                    disabled={!isGoalReached}
                    className={`w-full h-16 rounded-2xl font-bold transition-all duration-500 flex items-center justify-center gap-3 ${isGoalReached
                      ? "bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-xl cursor-pointer hover:brightness-110 opacity-100"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-70 border-2 border-dashed border-slate-200 shadow-none"
                      }`}
                  >
                    {isGoalReached ? (
                      <><Unlock className="h-5 w-5" /> RESGATAR 30 DIAS GRÁTIS!</>
                    ) : (
                      <><Lock className="h-5 w-5" /> COMPLETE 4 QUIZZES PARA GANHAR 30 DIAS</>
                    )}
                  </Button>
                  {!isGoalReached && (
                    <p className="text-center text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-widest">
                      Faltam {GOAL_COUNT - completedCount} módulos para liberar o acesso gratuito
                    </p>
                  )}
                </motion.div>
              </motion.div>

              {/* CARDS DE PLANOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <div className="group bg-white rounded-[2.5rem] p-8 border border-emerald-100 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-500">
                  <div>
                    <div className="flex justify-between items-center mb-8">
                      <div className="p-3 bg-emerald-50 rounded-2xl text-[#0D3B2E] group-hover:scale-110 transition-transform"><GraduationCap className="h-6 w-6" /></div>
                      <span className="text-[10px] font-black tracking-widest bg-emerald-100/50 px-3 py-1.5 rounded-full text-[#0D3B2E]">GRATUITO</span>
                    </div>
                    <h4 className="font-bold text-[#0D3B2E] text-2xl tracking-tight">Estudante</h4>
                    <p className="text-sm text-slate-500 mt-3 mb-8 leading-relaxed font-medium">Fundamentos essenciais para novos guardiões.</p>
                    <div className="space-y-4">
                      {["Quizzes Ilimitados", "Certificado Simples"].map((item) => (
                        <div key={item} className="flex items-center gap-3 text-sm font-bold text-[#0D3B2E]">
                          <div className="p-0.5 bg-emerald-500 rounded-full"><Check className="h-3 w-3 text-white" /></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-10 h-12 rounded-xl border-2 border-[#0D3B2E] text-[#0D3B2E] font-bold hover:bg-[#0D3B2E] hover:text-white transition-all">SABER MAIS</Button>
                </div>

                <div className="group bg-[#0D3B2E] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl flex flex-col relative overflow-hidden transition-all duration-500 hover:translate-y-[-5px]">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#EAB308] opacity-[0.05] rounded-full blur-3xl group-hover:opacity-20 transition-opacity" />
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-[#EAB308]"><Sparkles className="h-6 w-6" /></div>
                    <span className="text-[10px] font-black tracking-widest bg-[#EAB308] text-[#0D3B2E] px-3 py-1.5 rounded-full">PREMIUM</span>
                  </div>
                  <h4 className="font-bold text-white text-2xl tracking-tight relative z-10">Explorador</h4>
                  <p className="text-sm text-white/50 mt-3 mb-8 leading-relaxed font-medium relative z-10">Acesso total a relatórios e mentoria ambiental.</p>
                  <div className="space-y-4 relative z-10">
                    {["Conteúdo Exclusivo", "Suporte VIP 24h"].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm font-bold text-white/90">
                        <div className="p-0.5 bg-[#EAB308] rounded-full"><Check className="h-3 w-3 text-[#0D3B2E]" /></div>
                        {item}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-10 h-12 rounded-xl bg-[#EAB308] hover:bg-[#FACC15] text-[#0D3B2E] font-black transition-all shadow-lg shadow-yellow-900/20">VER PLANOS</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }