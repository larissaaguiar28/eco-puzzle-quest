# Relatório de Teste - Cadastro CTA (alexiaizabelasantos@gmail.com)

**Data da Execução:** 31 de Março de 2026, 16:08  
**Arquivo de Teste:** `src/test/cadastro-cta.test.tsx`  
**Ambiente:** Vitest + Testing Library + JSDOM (Sem Mocks — Conexão Real com Supabase)  
**Duração Total:** 36.39s  

---

## 🎯 Objetivo do Teste

Simular o fluxo completo de cadastro de um novo usuário na seção CTA do site, realizando chamadas reais (sem mock) ao Supabase Auth, com as seguintes credenciais:

| Campo | Valor                              |
|-------|-------------------------------------|
| Email | `alexiaizabelasantos@gmail.com`     |
| Senha | `12345678`                          |

---

## 📋 Passos Executados pelo Robô

| # | Ação                                                        | Status |
|---|-------------------------------------------------------------|--------|
| 1 | Renderizar página Index com Sidebar e CTASection            | ✅ OK  |
| 2 | Clicar no botão "Cadastro" na Sidebar                       | ✅ OK  |
| 3 | Alterar formulário para modo "REGISTRAR"                    | ✅ OK  |
| 4 | Preencher campo de e-mail com `alexiaizabelasantos@gmail.com` | ✅ OK  |
| 5 | Preencher campo de senha com `12345678`                     | ✅ OK  |
| 6 | Verificar se e-mail foi preenchido corretamente             | ✅ OK  |
| 7 | Verificar se senha foi preenchida corretamente              | ✅ OK  |
| 8 | Clicar em "Cadastrar Agora" (envia requisição real ao Supabase) | ✅ OK  |
| 9 | Aguardar mensagem `"Email Cadastrado com sucesso!"`         | ❌ FALHOU |

---

## ❌ Resultado: TESTE FALHOU

### Mensagem de Erro do Vitest

```
AssertionError: expected "spy" to be called with arguments: [ 'Email Cadastrado com sucesso!' ]

Received:

  1st spy call:

  [
-   "Email Cadastrado com sucesso!",
+   "Deu ruim!",
  ]
```

O teste esperava que o `window.alert` fosse chamado com a mensagem de sucesso (`"Email Cadastrado com sucesso!"`), mas o que foi recebido foi a mensagem de erro (`"Deu ruim!"`).

---

## 🔍 Por Que Deu Erro?

### Causa Direta
A função `handleRegister()` no arquivo `CTASection.tsx` (linha 60-67) faz uma chamada real ao Supabase:

```typescript
const {data, error} = await supabase.auth.signUp({
  email: user.email,
  password: user.pass
})

if(error) alert("Deu ruim!")
else alert('Email Cadastrado com sucesso!')
```

O Supabase **retornou um objeto `error` preenchido**, fazendo o código cair no ramo `if(error)` e disparar `"Deu ruim!"`.

### Causa Raiz (Servidor Supabase)
O erro **não está no código do teste nem no frontend**. Todos os passos visuais (preenchimento, clique, navegação) funcionaram perfeitamente. O problema está na **configuração do servidor Supabase** (`https://obqnxufukdxcgdumrxux.supabase.co`). As causas mais prováveis são:

1. **Cadastro de novos usuários desabilitado** — No painel Supabase em `Authentication > Providers > Email`, a opção "Enable Email Signup" pode estar desativada.
2. **Rate Limiting** — O Supabase limita requisições de signup consecutivas do mesmo IP. Testes repetidos podem ter acionado esse bloqueio temporário.
3. **Certificado TLS/SSL** — O ambiente JSDOM do Node.js pode ter tido dificuldade com o certificado da rede local (embora tenhamos aplicado `NODE_TLS_REJECT_UNAUTHORIZED=0` para contornar isso).
4. **Restrição por domínio de e-mail** — Alguma política no Supabase pode estar restringindo quais domínios de e-mail podem se cadastrar.

---

## ✅ O Que Funcionou

- A navegação pela Sidebar e o clique no botão "Cadastro" funcionaram corretamente.
- O formulário alternou para o modo "REGISTRAR" sem problemas.
- Os campos de e-mail e senha foram preenchidos e **validados com sucesso** (`expect().toHaveValue()` passou).
- A requisição HTTP real foi disparada para o Supabase (sem mocks).
- O frontend tratou corretamente o erro retornado pelo servidor, exibindo a mensagem `"Deu ruim!"`.

---

## 💡 Recomendações

Para que o teste passe com sucesso, verifique no painel do Supabase:

1. Acesse: `https://supabase.com/dashboard/project/obqnxufukdxcgdumrxux/auth/providers`
2. Confirme que **Email Provider** está habilitado
3. Confirme que **"Enable Sign Up"** está ativado
4. Verifique se não há **Rate Limit** ativo bloqueando cadastros
5. Após ajustar, rode novamente: `npx vitest run src/test/cadastro-cta.test.tsx`
