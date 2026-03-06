import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, AlertCircle, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404: Rota não encontrada ->", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Ícone Animado */}
        <div className="relative mb-8 inline-flex">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="rounded-2xl bg-muted p-4 shadow-inner"
          >
            <Search className="h-12 w-12 text-primary" />
          </motion.div>
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 shadow-lg"
          >
            <AlertCircle className="h-5 w-5 text-white" />
          </motion.div>
        </div>

        {/* Textos */}
        <h1 className="text-8xl font-black tracking-tighter text-foreground/10 sm:text-9xl">
          404
        </h1>
        
        <div className="-mt-12 sm:-mt-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Parece que você se perdeu
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A página <span className="font-mono text-primary">"{location.pathname}"</span> não existe ou foi movida.
          </p>
        </div>

        {/* Ações */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2 sm:w-auto"
          >
            <Home className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
            Ir para o Início
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-input bg-background px-8 py-4 font-semibold shadow-sm transition-all hover:bg-accent sm:w-auto"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
        </div>

        {/* Rodapé sutil */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-sm text-muted-foreground/50"
        >
          Se isso for um erro do sistema, por favor nos avise.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;