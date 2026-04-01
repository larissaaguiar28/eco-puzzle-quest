# Relatório de Testes - Pasta `src/test`

## Data de execução
- 31 de março de 2026

## Comandos usados
- `npx vitest run src/test --reporter=verbose`
- `npm test -- --reporter=verbose` (nota: este comando pode não descobrir corretamente os arquivos no `src/test` dependendo da configuração do runner)

## Resultados de execução
- Arquivos de teste encontrados: 2
- Testes executados: 4
- Tests aprovados: 4
- Tests falhados: 0
- Duração total: 3.79s

## Detalhamento por arquivo

### `src/test/example.test.ts`
- Testes: 1
- Resultado: aprovado
- Cenário: validação do ambiente de teste do Vitest.

### `src/test/integration/Chatbot.integration.test.ts`
- Testes: 3
- Resultado: aprovados
- Cenários:
  1. Mensagem enviada => resposta correta + histórico armazenado.
  2. Envio de anexo => arquivo registrado e dados preservados.
  3. Erro de API 500 => falha controlada, histórico mantido.

## Observações do relatório
- A suíte de testes atual é pequena e foca em estabilidade básica e integração do chat EcoBot.
- O comando `npx vitest run src/test --reporter=verbose` lista corretamente todos os testes do diretório.
- Se surgir qualquer problema de descoberta de testes pelo script `npm test`, confira a configuração `include` em `vitest.config.ts`.

## Recomendações
- Adicionar mais casos de teste para fluxos de UI do chat, validação de formulários e rotas.
- Incluir testes de unidade para utilitários e componentes isolados.
- Manter a documentação dos testes atualizada sempre que um novo caso de uso for implementado.
