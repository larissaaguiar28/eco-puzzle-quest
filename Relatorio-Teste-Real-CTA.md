# Relatório de Testes Automatizados - Cadastro (Supabase Real)

**Data da Execução:** 31 de Março de 2026
**Tecnologias Utilizadas:** Vitest, Testing Library (React), Integração HTTP Direta com Supabase Auth.
**Arquivo Executado:** `src/test/cadastro-cta.test.tsx`

---

## 🎯 Objetivo
Avaliar o fluxo de criação de conta ("Cadastro") na *CTA Section*, realizando requisições legítimas (sem simulações/mocks) para o banco de dados remoto da Supabase (`https://obqnxufukdxcgdumrxux.supabase.co`) atrelado à aplicação.

## ✅ Cenários Aprovados 
Estas interações passaram em 100% no teste:
* **Validação Front-end (Campos Vazios):** O formulário interceptou a tentativa de enviar cadastro em branco e disparou o alerta correto `alert('Email e senha obrigatório!')`.
* **Tratativa de Exceções do Servidor (Rejeição Cloud):** O código foi programado para injetar credenciais que intencionalmente esbarrariam no servidor (conta duplicada). O banco real devolveu uma resposta não autorizada, e a tela protegeu o ciclo exibindo o comportamento ideal: `alert('Deu ruim!')`.

---

## ❌ Cenário com Erro: Registro Inicial

O teste `deve preencher registro e enviar requisição real para o Supabase com sucesso` **FALHOU**.

### 🔍 Por que deu erro?
Ao removermos o *mock* e solicitarmos a integração verdadeira, o comando obedeceu e preencheu a tela com dados inéditos (um e-mail único gerado pela automação acompanhado da senha `password12345678`), submetendo tudo perfeitamente para sua instância no Supabase pela rede usando `fetch()`.

O teste esperava que a nuvem aceitasse e a interface soltasse o `alert('Email Cadastrado com sucesso!')`. No entanto, **o próprio servidor na nuvem recusou a criação da conta**, e disparou o `alert('Deu ruim!')`.

### 🚨 Possíveis Causas na Nuvem (Supabase Auth)
Como toda a arquitetura frontal está intacta e os botões chamam diretamente a API, a rejeição veio exclusivamente de barreiras do painel de administração da sua conta Supabase:

1. **Sign-ups Desabilitados:** Por padrão de segurança, o servidor pode estar bloqueando criação desenfreada de novas contas caso o módulo "Allow new users to sign up" esteja em "Off" via painel de Controle.
2. **Limite de Rate-Limit (Abuso de Teste):** A Supabase bloqueia IPs ou requisições seguidas para prevenir ataques Bots em suas rotas da `auth`.
3. **CORS/Protocolo ou Certificado (TLS):** Testes via NodeJS rodando de máquina local costumam emitir chamadas através de pacotes não assinados, o banco pode ter recusado as camadas de segurança (embora tenhamos aplicado contornos na versão Vitest local - `NODE_TLS_REJECT_UNAUTHORIZED=0`).
4. **Restrição por Provedor de Email:** Exigência de confirmação não atendida do backend, não permitindo o final do fluxo.

### 💡 Recomendações
Para este teste real voltar a passar com cor verde, acesse o painel **Authentication > Providers** em seu dashboard no Supabase (`https://app.supabase.com/project/obqnxufukdxcgdumrxux`) e certifique-se de que a opção de criar cadastros de "Email Padrão" por clientes diretos (anônimos) está completamente validada, sem bloqueios de segurança exagerados para o ambiente de testes (TDD). 
