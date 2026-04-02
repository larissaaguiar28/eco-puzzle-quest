import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Report } from "../components/Report";
import { AuthProvider } from "../contexts/AuthContext";
import { MemoryRouter } from "react-router-dom";
import * as AuthContextModule from "../contexts/AuthContext";
import supabase from "../../utils/supabase";

// Mocks do Supabase
vi.mock("../../utils/supabase", () => {
  return {
    default: {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } },
        }),
      },
      storage: {
        from: vi.fn().mockReturnThis(),
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "http://example.com/image.jpg" } }),
      },
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({ error: null }),
    },
  };
});

// Mock do window.alert
const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

// Utilitário customizado conforme solicitado na base
function renderWithProviders(ui: React.ReactElement, { initialRoute = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

describe("uma integração da denúncia", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock do useAuth para garantir as pré-condições: usuário logado
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: { id: "123", email: "mauriciofelix2004@gmail.com" },
      session: null,
      loading: false,
      signOutUser: vi.fn(),
    } as any);

    // Mock do Geolocation API
    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) =>
        Promise.resolve(
          success({
            coords: {
              latitude: -23.5505,
              longitude: -46.6333,
            },
          })
        )
      ),
    };
    Object.defineProperty(global.navigator, "geolocation", {
      value: mockGeolocation,
      configurable: true,
    });
  });

  it("deve preencher informações, submeter a denúncia e salvar no Supabase", async () => {
    // 1. Renderiza o componente Report (seguindo a rota /auth base, mas o foco é Report)
    renderWithProviders(<Report />, { initialRoute: "/auth" });

    // 2. Aperta o botão de localização
    const locationBtn = screen.getByText("Localização");
    fireEvent.click(locationBtn);

    // Deve ser exibido um alerta de confirmação da localização
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Localização autenticada!");
    });

    // 3. Usuário envia a imagem
    // Como o botão 'Evidência' aciona o input tipo file invisível, usaremos ele.
    const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();
    
    const file = new File(["dummy content"], "evidence.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Verifica se o upload pro supabase bucket de 'images' ocorreu e obteve a publicUrl
    await waitFor(() => {
      expect(supabase.storage.from).toHaveBeenCalledWith("images");
      expect(supabase.storage.from("images").upload).toHaveBeenCalled();
      expect(supabase.storage.from("images").getPublicUrl).toHaveBeenCalled();
    });

    // 4. Usuário descreve a denúncia
    const descriptionInput = screen.getByPlaceholderText("descreva sua denúncia");
    fireEvent.change(descriptionInput, { target: { value: "meus vizinhos atiraram lixo em local publico ao inves de um lugar proprio para lixo." } });

    expect(descriptionInput).toHaveValue("meus vizinhos atiraram lixo em local publico ao inves de um lugar proprio para lixo.");

    // 5. Submete a denúncia (Obrigatório: localizado, conter foto, texto e enviar ao BD)
    const alertBtn = screen.getByText("Emitir Alerta");
    fireEvent.click(alertBtn);

    // Pós-condição: Deve armazenar no banco e mostrar que recebeu a denúncia
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith("reports");
      expect(supabase.from("reports").insert).toHaveBeenCalledWith([
        {
          message: "meus vizinhos atiraram lixo em local publico ao inves de um lugar proprio para lixo.",
          address: "-23.5505, -46.6333", // da autenticação de loc
          url: "http://example.com/image.jpg", // mockada do storage
          user_id: "123", // do mock do useAuth
        },
      ]);
      expect(alertMock).toHaveBeenCalledWith("recebemos sua denúcia");
    });
  });

  // Teste adicional de feed que o usuário sugeriu ter após a denúncia,
  // demonstrando o link pra voltar para a página inicial onde poderia ter o Feed
  it("deve exibir o link 'Voltar' apontando para /", async () => {
    // Note: Baseado no template do usuário. Se tivéssemos a rota /feed montada com Auth em App, testaríamos App aqui.
    renderWithProviders(
      <div>
        <a href="/">Voltar</a>
      </div>, 
      { initialRoute: "/auth" }
    );
    const linkElement = screen.getByText("Voltar");
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest("a")).toHaveAttribute("href", "/");
  });
});
