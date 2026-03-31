# Relatório de Testes Automatizados - Cadastro (CTA)

**Data de Inclusão:** 31 de Março de 2026
**Tecnologias Utilizadas:** Vitest, Testing Library (React), JSDOM.
**Arquivo de Configuração/Teste:** `src/test/cadastro-cta.test.tsx`

---

## 🎯 Objetivo
O principal objetivo deste teste de integração (E2E a nível de componente) foi validar a rotina completa de cadastro de um usuário através da *CTA Section*, testando o preenchimento de formulário simulando o comportamento de um usuário real desde o início do fluxo na barra lateral (*Sidebar*).

## 🛠 Ambientes e Simulações (Mocks)

Como o teste é executado em um ambiente sem navegador gráfico (*JSDOM*), adotamos as seguintes simulações para replicar comportamentos e proteger o seu banco de dados na nuvem:

* **Mock do "Supabase":** A requisição `supabase.auth.signUp` foi interceptada (Mockada). Quando o código a executa, ela simula um registro bem sucedido da variável enviada de E-mail (`lekaowl@gmail.com`). Evitando sobrecarga real no banco.
* **Mock do "IntersectionObserver" e "ResizeObserver":** Falsificamos ambas APIs para impedir erros de bibliotecas de Gráficos (`Recharts`) ou Navegação de seções.
* **Mock do "ScrollIntoView":** Permitindo o clique correto pela Sidebar sem travar.

## ✅ Cenários Testados e Aprovados (Sucesso de 100%)

### 1. Cenário Principal: Navegação e Preenchimento Correto (Caminho Feliz)
Avaliamos a capacidade do usuário transitar no site para criar uma conta e submeter seus dados, onde a aplicação realiza:
1. Renderização virtual do Router completo.
2. Identificação do botão de **Cadastro** na `AppSidebar` e simulação de Clique.
3. Troca da aba "ENTRAR" para "REGISTRAR".
4. Preenchimento de texto focado no campo E-mail com: `lekaowl@gmail.com`
5. Preenchimento de senha focado no campo Senha com:`12345678`
6. Verifica logicamente se a tela atribuiu sucesso aos *inputs* de fato.
7. Submissão do "Cadastrar Agora".

**Resultado Esperado e Confirmado:** 
O mock do Supabase confirmou ação, e o sistema emitiu o alerta exato do JavaScript `alert('Email Cadastrado com sucesso!')`.

### 2. Tratamento de Exceções: Campos em Branco
Avaliamos a capacidade de defesa da sua tela contra ações levianas.
- Clicamos em registrar e enviamos o formulário em branco.
- **Resultado Esperado e Confirmado:** O sistema exibiu a mensagem de bloqueio `alert('Email e senha obrigatório!')`.

### 3. Tratamento de Exceções: Erro de Nuvem / Falhas no API Backend
E se o backend falhar ou o e-mail não mandar por problemas no `Supabase`?
- Ajustamos o Mock momentaneamente para injetar erro (`400 API AuthError`) em uma requisição forçada.
- **Resultado Esperado e Confirmado:** Sua UI suportou e disparou apropriadamente a mensagem `alert("Deu ruim!")`.

## 🚀 Como Executar Novamente

Para rodar este arquivo a qualquer momento em seu terminal local, cole o seguinte comando:
```bash
npx vitest run src/test/cadastro-cta.test.tsx
```

Ou, caso deseje acompanhar em tempo real de forma automática (Test Driven Development) sem desligar a aplicação:
```bash
npx vitest src/test/cadastro-cta.test.tsx
```
