import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CTASection } from '../src/components/sections/CTASection';
import { QuizProvider } from '../src/contexts/QuizContext';

// Mocar o módulo supabase para não fazer requisições reais no backend durante o teste
vi.mock('../utils/supabase', () => {
  return {
    default: {
      auth: {
        signInWithPassword: vi.fn(),
        signUp: vi.fn()
      }
    }
  };
});

import supabase from '../utils/supabase';

describe("Testes Funcionais de Login - CTASection", () => {
  beforeEach(() => {
    // Limpa mocks antes de cada teste e moca o window.alert
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <QuizProvider>
          <CTASection />
        </QuizProvider>
      </BrowserRouter>
    );
  };

  it("deve exibir o formulário de login por padrão, preencher dados e enviar (U001)", async () => {
    const user = userEvent.setup();
    renderComponent();

    // 1. Verificar se o formulário está carregado
    const loginTabButton = screen.getByRole('button', { name: /entrar/i });
    expect(loginTabButton).toBeInTheDocument();

    // 2. Localizar os campos (E-mail e Senha) pelos Placeholders da UI
    const emailInput = screen.getByPlaceholderText(/seu@email\.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const accessButton = screen.getByRole('button', { name: /acessar portal/i });
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    // 3. Preencher os campos de email e senha válidos
    await user.type(emailInput, 'usuario-correto@email.com');
    await user.type(passwordInput, 'senha-correta');

    // Configurando o Supabase para retornar sucesso no login
    (supabase.auth.signInWithPassword as any).mockResolvedValue({ 
        data: { user: { id: "123"} }, 
        error: null 
    });

    // 4. Clicar no botão e verificar se o Auth Backend (Supabase) foi chamado com as credenciais corretas
    await user.click(accessButton);

    await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: 'usuario-correto@email.com',
            password: 'senha-correta'
        });
    });
  });

  it("deve exibir alerta (mensagem) caso email e/ou senha estejam errados", async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByPlaceholderText(/seu@email\.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const accessButton = screen.getByRole('button', { name: /acessar portal/i });

    await user.type(emailInput, 'qualquer-email@invalido.com');
    await user.type(passwordInput, 'senha-errada');

    // Configurando o Supabase para simular erro
    (supabase.auth.signInWithPassword as any).mockResolvedValue({ 
        data: null, 
        error: { message: "Invalid login credentials" } 
    });

    await user.click(accessButton);

    // O componente usa window.alert(error.message) para mostrar o erro de acordo com sua implementação
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid login credentials");
    });
  });

  it("deve exibir alerta informando que campos são obrigatórios se vazios", async () => {
    const user = userEvent.setup();
    renderComponent();

    const accessButton = screen.getByRole('button', { name: /acessar portal/i });
    
    // Tentativa de login sem preencher nada
    await user.click(accessButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Email e senha são obrigatórios");
    });
  });
});
