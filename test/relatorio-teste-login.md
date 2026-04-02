# Relatório de Teste Automatizado — Login (CTASection)

**Data de Execução:** 01/04/2026 — 15:20  
**Ferramenta:** Vitest v3.2.4 + Testing Library + jsdom  
**Arquivo de Teste:** `test/Login.test.tsx`  
**Componente Testado:** `CTASection` (`src/components/sections/CTASection.tsx`)  
**Duração Total:** 7.21s  

---

## Resumo Geral

| Métrica          | Resultado        |
|------------------|------------------|
| Arquivos de Teste | 2 passaram (2)  |
| Testes Executados | **4 passaram** (4) |
| Testes de Login   | **3 passaram** (3) |
| Testes Falhados   | 0               |
| Status Geral      | ✅ **APROVADO**  |

---

## Casos de Teste Executados

### ✅ TC-U001 — Login com credenciais válidas
| Campo              | Detalhe                                                    |
|--------------------|------------------------------------------------------------|
| **ID**             | U001                                                       |
| **Descrição**      | Deve exibir o formulário de login, preencher dados e enviar |
| **Pré-condição**   | Formulário de login renderizado via CTASection              |
| **Dados de Entrada** | Email: `usuario-correto@email.com` / Senha: `senha-correta` |
| **Ação**           | Preencher email e senha → Clicar em "Acessar Portal"       |
| **Resultado Esperado** | `supabase.auth.signInWithPassword` chamado com as credenciais corretas |
| **Status**         | ✅ Passou (1148ms)                                         |

---

### ✅ TC-U002 — Login com credenciais inválidas
| Campo              | Detalhe                                                    |
|--------------------|------------------------------------------------------------|
| **ID**             | U002                                                       |
| **Descrição**      | Deve exibir alerta caso email e/ou senha estejam errados   |
| **Pré-condição**   | Formulário de login renderizado via CTASection              |
| **Dados de Entrada** | Email: `qualquer-email@invalido.com` / Senha: `senha-errada` |
| **Ação**           | Preencher credenciais inválidas → Clicar em "Acessar Portal" |
| **Resultado Esperado** | `window.alert` chamado com `"Invalid login credentials"` |
| **Status**         | ✅ Passou (1047ms)                                         |

---

### ✅ TC-U003 — Login com campos vazios
| Campo              | Detalhe                                                    |
|--------------------|------------------------------------------------------------|
| **ID**             | U003                                                       |
| **Descrição**      | Deve exibir alerta informando que campos são obrigatórios  |
| **Pré-condição**   | Formulário de login renderizado via CTASection              |
| **Dados de Entrada** | Nenhum (campos vazios)                                    |
| **Ação**           | Clicar em "Acessar Portal" sem preencher nada              |
| **Resultado Esperado** | `window.alert` chamado com `"Email e senha são obrigatórios"` |
| **Status**         | ✅ Passou                                                  |

---

## Cobertura de Cenários

| Cenário                       | Coberto? |
|-------------------------------|----------|
| Login com sucesso             | ✅        |
| Login com credenciais erradas | ✅        |
| Login com campos vazios       | ✅        |

---

## Dependências de Teste

| Pacote                         | Versão   |
|--------------------------------|----------|
| `vitest`                       | ^3.2.4   |
| `@testing-library/react`      | ^16.0.0  |
| `@testing-library/user-event` | ^14.6.1  |
| `@testing-library/jest-dom`   | ^6.6.0   |
| `jsdom`                       | ^20.0.3  |

---

## Correções Aplicadas Durante a Execução

1. **`@testing-library/user-event` versão inexistente** — A versão `^14.7.0` no `package.json` não existia no npm. Corrigida para `^14.6.1`.
2. **`vitest.config.ts` — caminho do include** — O padrão `teste/**` foi atualizado para `test/**` conforme renomeação da pasta de testes.
3. **Mock de `IntersectionObserver`** — O ambiente `jsdom` não implementa `IntersectionObserver`, necessário pelo `framer-motion` (animações `whileInView`). Mock adicionado em `src/test/setup.ts`.

---

## Conclusão

> [!TIP]
> Todos os 3 testes funcionais de login foram executados com sucesso. O componente `CTASection` está validando corretamente: autenticação via Supabase, tratamento de erro para credenciais inválidas e validação de campos obrigatórios.

**Resultado Final: ✅ APROVADO**
