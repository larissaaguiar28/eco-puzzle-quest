# Documentação dos Testes em `src/test`

## Visão geral
A pasta `src/test` contém a base de testes do projeto, incluindo configuração global e casos de teste automatizados. O objetivo é garantir que a aplicação funcione corretamente em cenários de integração e validações básicas de ambiente.

## Estrutura da pasta
- `src/test/setup.ts`
  - Configura o ambiente de testes para o `jsdom`.
  - Define um polyfill de `window.matchMedia` usado por componentes e testes que dependem de media queries.
- `src/test/example.test.ts`
  - Exemplo de teste básico para validar o ambiente do `Vitest`.
  - Possui um único caso de teste: `should pass`.
- `src/test/integration/Chatbot.integration.test.ts`
  - Contém testes de integração para o EcoBot do chat.
  - Valida comportamento de envio de mensagens, anexos e tratamento de erro.

## Configuração de testes
O `vitest.config.ts` configura o ambiente de testes com:
- `environment: "jsdom"`
- `globals: true`
- `setupFiles: ["./src/test/setup.ts"]`
- `include: ["src/**/*.{test,spec}.{ts,tsx}"]`

## Documentação por teste

### `src/test/example.test.ts`
- `describe("example")`
  - `it("should pass")`
- Objetivo: confirmar que o runner do Vitest está funcionando corretamente.
- Resultado esperado: `true` deve ser igual a `true`.
- Tipo: Smoke test / validação de ambiente.

### `src/test/integration/Chatbot.integration.test.ts`
Este arquivo possui três cenários descritos abaixo.

#### 1. `Após a troca de mensagem, ele deve responder corretamente e armazenar todos os dados da conversa.`
- Tipo: Integração.
- Entrada: mensagem do usuário enviada ao EcoBot.
- Saída esperada:
  - `fetch` chamada ao endpoint correto.
  - histórico enviado corretamente.
  - resposta do bot reconstruída a partir do stream SSE.
  - histórico final contém mensagem inicial do bot, mensagem do usuário e resposta do bot.
- Critério: bot responde com conteúdo esperado e o histórico mantém 3 mensagens.

#### 2. `Ao enviar uma foto/anexo, o bot deve registrar o envio e armazenar os dados do arquivo na conversa.`
- Tipo: Integração.
- Entrada: mensagem de usuário que inclui arquivo de imagem.
- Saída esperada:
  - o objeto de mensagem do usuário contém metadados do arquivo (`name`, `type`, `url`).
  - a API retorna uma resposta coerente.
- Critério: o arquivo deve ser registrado e o histórico deve preservar dados de anexo.

#### 3. `Quando a API retorna erro, o chat deve exibir mensagem de falha e não quebrar o histórico existente.`
- Tipo: Integração.
- Entrada: requisição que retorna `500`.
- Saída esperada:
  - `response.ok` false.
  - status 500.
  - corpo de erro presente.
  - fallback de erro mantém a integridade do histórico.
- Critério: falha controlada sem quebrar o fluxo.

## Como executar os testes
Comando recomendado:
```bash
npx vitest run src/test --reporter=verbose
```

Também pode ser executado via script NPM:
```bash
npm test -- --reporter=verbose
```

## Observações
- O arquivo `src/test/setup.ts` deve permanecer ativo para manter o ambiente `jsdom` consistente.
- Testes de integração usam mocks de `fetch` e simulações de SSE.
- Caso novos testes sejam adicionados, siga o padrão `*.test.ts` ou `*.spec.ts` em `src/`.
