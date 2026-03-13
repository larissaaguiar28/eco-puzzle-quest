

# Plano: Integrar IA real no EcoBot (Lovable AI Gateway)

## Objetivo
Substituir as respostas hardcoded do EcoBot por respostas reais usando o Lovable AI Gateway (Gemini), permitindo conversas sobre qualquer assunto.

## Arquitetura

```text
FloatingChatbot / Chatbot.tsx
        ↓
   ChatContext.tsx (sendMessage)
        ↓
   Supabase Edge Function (chat)
        ↓
   Lovable AI Gateway (Gemini 3 Flash)
        ↓
   Streaming de resposta → UI
```

## Etapas

### 1. Criar Edge Function `supabase/functions/chat/index.ts`
- Recebe o histórico de mensagens do frontend
- Adiciona system prompt de sustentabilidade: "Você é o EcoBot, um assistente especializado em sustentabilidade e meio ambiente. Responda em português."
- Chama `https://ai.gateway.lovable.dev/v1/chat/completions` com streaming
- Usa `LOVABLE_API_KEY` (já disponível) para autenticação
- Trata erros 429 (rate limit) e 402 (créditos)

### 2. Configurar `supabase/config.toml`
- Adicionar entry para a função `chat` com `verify_jwt = false`

### 3. Atualizar `ChatContext.tsx`
- Remover respostas hardcoded (`getReply`, objeto `responses`)
- Implementar chamada streaming à edge function via `fetch`
- Processar tokens SSE e atualizar a mensagem do bot progressivamente
- Manter interface existente (`messages`, `typing`, `sendMessage`, `addBotMessage`, `clearChat`)

### 4. Componentes que usam o contexto
- **FloatingChatbot.tsx** e **Chatbot.tsx** já consomem `useChatContext()` — não precisam de alteração, pois a interface do contexto permanece a mesma
- A mudança é transparente para os componentes de UI

## Detalhes técnicos
- Modelo: `google/gemini-3-flash-preview` (rápido e gratuito incluído)
- System prompt no backend (nunca no cliente)
- Histórico completo enviado a cada requisição para manter contexto da conversa
- Streaming token-by-token para UX responsiva

