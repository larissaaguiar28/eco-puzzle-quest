import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle } from "lucide-react"; // Ícones dão um ar profissional

const NotFound = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Um log mais detalhado ajuda no monitoramento (ex: Sentry ou LogRocket)
    console.error(`[404] Rota não encontrada: ${pathname} em ${new Date().toISOString()}`);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-center">
      {/* Elemento visual de destaque */}
      <div className="relative mb-8">
        <h1 className="text-9xl font-extrabold tracking-widest text-muted-foreground/20">
          404
        </h1>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded bg-primary px-2 text-sm font-medium text-primary-foreground">
          Página não encontrada
        </div>
      </div>

      <div className="max-w-md">
        <h2 className="mb-3 text-2xl font-bold md:text-3xl">
          Parece que você se perdeu...
        </h2>
        <p className="mb-8 text-muted-foreground">
          A página <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">{pathname}</code> não existe ou foi movida para outro universo.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 active:scale-95"
          >
            <Home size={18} />
            Voltar ao Início
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <AlertCircle size={18} />
            Página Anterior
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;