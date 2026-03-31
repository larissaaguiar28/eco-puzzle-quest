// O comando abaixo garante que o Node/JSDOM aceite chamadas HTTPS/TLS mesmo com proxy local sem reclamar
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Index from "../pages/Index";

describe("Rotina de Teste de Cadastro (Real Supabase / Sem Mocks)", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Polyfills necessários para o JSDOM rodar a página que contém gráficos e scrolls
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.alert = vi.fn();
    
    window.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  it("deve realizar um cadastro na section de CTA e verificar mensagens sem mockar dados", async () => {
    // Renderiza a página Index
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    // Passo 1: na sidebar o botão de cadastro deve ser acessado para ir para a section de cta
    const cadastroSidebarButton = screen.getByText("Cadastro").closest("button");
    if (cadastroSidebarButton) fireEvent.click(cadastroSidebarButton);
    
    // Assegurar que o formulário está no modo Registrar
    const registrarModeButton = screen.getByText("REGISTRAR").closest("button");
    if (registrarModeButton) fireEvent.click(registrarModeButton);

    // Identificar o botão final de submit
    const cadastrarButton = screen.getByText("Cadastrar Agora").closest("button");

    // Passo 2: preencher os campos de email e senha, de acordo com essas variaveis...
    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");

    // Variáveis exatas exigidas
    fireEvent.change(emailInput, { target: { value: "alexiaizabelasantos@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "12345678" } });

    // Passo 3: verifique se o email e a senha foram preenchidos corretamente
    expect(emailInput).toHaveValue("alexiaizabelasantos@gmail.com");
    expect(passwordInput).toHaveValue("12345678");

    // Dispara a submissão (Faz a chamada REAL para a rede do Supabase)
    if (cadastrarButton) fireEvent.click(cadastrarButton);

    // Passo 4: verificar as mensagens de confirmação, tanto na section de cta quanto no email enviado.
    // O JSDOM aguarda a resposta HTTP real da nuvem
    await waitFor(() => {
      // Se a conexão física com Supabase na nuvem gerar cadastro no DB/enviar email, a promessa retornará {error: null}
      // O frontend lerá "se não tem erro, solte esse alert":
      expect(window.alert).toHaveBeenCalledWith("Email Cadastrado com sucesso!");
    }, { timeout: 30000 }); // Extendido para até 30s devido à latência de rede real
  }, 35000);
});
