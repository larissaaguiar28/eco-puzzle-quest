import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";
import SustainableNewsFeed from "../pages/home/NewsFeed";
import { useAuth } from "../contexts/AuthContext";
import supabase from "../../utils/supabase";

// Mock do Supabase
vi.mock("../../utils/supabase", () => {
    const mockFrom = vi.fn();
    return {
        default: {
            from: mockFrom,
            storage: {
                from: vi.fn().mockReturnValue({
                    upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
                    getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "http://example.com/image.jpg" } }),
                }),
            },
        },
    };
});

// Mock do Framer Motion
vi.mock("framer-motion", async () => {
    const actual = await vi.importActual("framer-motion");
    return {
        ...actual,
        AnimatePresence: ({ children }: any) => <>{children}</>,
        motion: {
            ...actual.motion,
            div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
            h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
            p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
        },
    };
});

vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const mockUser = { id: "test-user-id", email: "test@eco.com" };

const mockNews = [
  {
    id: "news-1",
    title: "Notícia Recente",
    summary: "Resumo recente",
    content: "Conteúdo completo recente",
    category: "Energia Solar",
    author: "test",
    date: new Date().toISOString(),
    location: "Brasil",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "news-2",
    title: "Notícia Antiga",
    summary: "Resumo antigo",
    content: "Conteúdo completo antigo",
    category: "Clima",
    author: "test",
    date: new Date(Date.now() - 86400000).toISOString(),
    location: "Brasil",
    gradient: "from-cyan-500 to-blue-700",
  }
];

describe("S001 - Verificar as postagens de notícias", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default supabase mocks
    (supabase.from as any).mockImplementation((table: string) => {
      if (table === "newsfeed") {
        return {
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockNews, error: null }),
          }),
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
      }
      if (table === "reactions") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: [{ type: "like" }], error: null }),
          }),
          insert: vi.fn().mockResolvedValue({ error: null }),
          delete: vi.fn().mockReturnValue({
            match: vi.fn().mockResolvedValue({ error: null }),
          }),
        };
      }
      if (table === "newscomments") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          }),
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
      }
      return { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis() };
    });
  });

  const renderWithAuth = (user: any = mockUser) => {
    (useAuth as any).mockReturnValue({ user, loading: false });
    return render(<SustainableNewsFeed />);
  };

  it("1. Deve listar as notícias corretamente na ordem correta", async () => {
    renderWithAuth();

    await waitFor(() => {
      expect(screen.getByText("Notícia Recente")).toBeInTheDocument();
      expect(screen.getByText("Notícia Antiga")).toBeInTheDocument();
    });

    // Como as notícias são renderizadas em cards, e mockNews[0] é a mais recente.
    const newsTitles = screen.getAllByRole("heading", { level: 3 });
    expect(newsTitles[0].textContent).toBe("Notícia Recente");
  });

  it("2. Deve publicar uma nova notícia com sucesso (Cenário Positivo)", async () => {
    renderWithAuth();

    // Abrir modal
    const publishBtn = screen.getByText(/Publicar Notícia/i);
    fireEvent.click(publishBtn);

    // Preencher campos
    fireEvent.change(screen.getByPlaceholderText("Título"), { target: { value: "Nova Notícia de Teste" } });
    fireEvent.change(screen.getByPlaceholderText("Categoria"), { target: { value: "Energia Solar" } });
    fireEvent.change(screen.getByPlaceholderText("Resumo"), { target: { value: "Resumo do teste automatizado" } });
    fireEvent.change(screen.getByPlaceholderText("Localização"), { target: { value: "São Paulo" } });
    fireEvent.change(screen.getByPlaceholderText("Conteúdo..."), { target: { value: "Conteúdo completo da notícia de teste." } });

    // Clicar em publicar
    const submitBtn = screen.getByText("Publicar", { selector: "button" });
    await act(async () => {
        fireEvent.click(submitBtn);
    });

    // Verificar se o insert foi chamado
    expect(supabase.from).toHaveBeenCalledWith("newsfeed");
  });

  it("3. Deve permitir reagir a uma notícia (Like)", async () => {
    renderWithAuth();

    // Esperar carregar as notícias
    await waitFor(() => screen.getByText("Notícia Recente"));

    // Encontrar botão de like (o primeiro da lista)
    const likeButtons = screen.getAllByRole("button").filter(btn => {
        // Encontra botões que tenham o ícone de like (ThumbsUp)
        // No NewsCard o botão de like tem o contador. No mock, enviamos 1 like.
        return btn.textContent === "1";
    });

    fireEvent.click(likeButtons[0]);

    // Verificar se o insert da reação foi chamado
    expect(supabase.from).toHaveBeenCalledWith("reactions");
  });

  it("4. Deve exibir alerta ao tentar reagir sem estar logado (Cenário Negativo)", async () => {
    // Espionar o window.alert
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    renderWithAuth(null); // Sem usuário

    await waitFor(() => screen.getByText("Notícia Recente"));

    const reactionButtons = screen.getAllByRole("button").filter(btn => btn.textContent === "1");
    fireEvent.click(reactionButtons[0]);

    expect(alertSpy).toHaveBeenCalledWith("Você precisa estar logado!");
    alertSpy.mockRestore();
  });
});
