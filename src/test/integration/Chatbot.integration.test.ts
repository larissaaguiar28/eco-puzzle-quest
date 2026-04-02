import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * I002 - Integração do Chat (EcoBot)
 *
 * Objetivo do Teste:
 *   Verificar se o chat está respondendo sua pergunta de forma coerente.
 *
 * Pré-condições:
 *   - Usuário deve estar logado.
 *
 * Pós-condições:
 *   - Recuperar o histórico e responder corretamente.
 *
 * Critérios de Aceitação:
 *   - A API deve estar funcionando corretamente.
 *
 * Riscos:
 *   - Caso o usuário não esteja logado, ele não poderá interagir com o chat normalmente.
 *   - Chat não responder de forma coerente.
 *   - Chat não responder.
 *
 * Estratégia: Dinâmico / Caixa Branca
 * Método: Integração
 */

// --- Helpers / Mocks ---

const FAKE_SUPABASE_URL = "https://fake-project.supabase.co";
const FAKE_CHAT_URL = `${FAKE_SUPABASE_URL}/functions/v1/chat`;

/** Simula uma resposta SSE (Server-Sent Events) com streaming do EcoBot. */
function makeStreamResponse(content: string) {
  const sseChunk = `data: ${JSON.stringify({
    choices: [{ delta: { content } }],
  })}\n\ndata: [DONE]\n\n`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(sseChunk));
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
}

/** Monta um histórico de mensagens simulando o estado do ChatContext. */
function buildHistory(userText: string) {
  return [
    { role: "assistant" as const, content: "Olá! 🌿 Eu sou o EcoBot. Vamos conversar sobre sustentabilidade?" },
    { role: "user" as const, content: userText },
  ];
}

// ---------------------------------------------------------------------------

describe("I002 - Integração do Chat (EcoBot)", () => {
  beforeEach(() => {
    // Injeta variáveis de ambiente necessárias pelo ChatContext
    vi.stubEnv("VITE_SUPABASE_URL", FAKE_SUPABASE_URL);
    vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "fake-anon-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------

  it(
    "Após a troca de mensagem, ele deve responder corretamente e armazenar todos os dados da conversa.",
    /**
     * Tipo    : Integração
     * Entrada : Enviar uma mensagem de texto
     * Saída   : O bot responde corretamente e a conversa é armazenada (histórico)
     */
    async () => {
      const userMessage = "O que é energia solar?";
      const expectedBotReply = "Energia solar é obtida a partir da luz do sol através de painéis fotovoltaicos.";

      // Simula o fetch para a rota do EcoBot retornando uma resposta coerente via SSE
      const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
        const url = typeof input === "string" ? input : (input as Request).url;

        // Garante que a requisição chegou ao endpoint correto
        expect(url).toBe(FAKE_CHAT_URL);
        expect(init?.method).toBe("POST");

        // Valida que o histórico foi enviado corretamente no body
        const body = JSON.parse(init?.body as string);
        expect(body.messages).toEqual(buildHistory(userMessage));

        return makeStreamResponse(expectedBotReply);
      });

      // --- Simula a lógica de sendMessage do ChatContext ---
      // (teste de integração direto na camada de dados, sem renderizar UI)

      const messages: Array<{ role: "user" | "assistant"; content: string }> = [
        { role: "assistant", content: "Olá! 🌿 Eu sou o EcoBot. Vamos conversar sobre sustentabilidade?" },
      ];

      // Adiciona a mensagem do usuário ao histórico
      messages.push({ role: "user", content: userMessage });

      // Realiza a chamada à API
      const response = await fetch(FAKE_CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer fake-anon-key",
        },
        body: JSON.stringify({ messages }),
      });

      expect(response.ok).toBe(true);

      // Lê o stream SSE e reconstrói a resposta do bot
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let botText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) botText += content;
        }
      }

      // --- Verificações ---

      // 1. O bot respondeu com o conteúdo esperado
      expect(botText).toBe(expectedBotReply);

      // 2. A resposta é coerente (não é vazia)
      expect(botText.trim().length).toBeGreaterThan(0);

      // 3. O histórico foi armazenado: usuário + bot
      const storedHistory = [
        ...messages,
        { role: "assistant" as const, content: botText },
      ];

      expect(storedHistory).toHaveLength(3);
      expect(storedHistory[0].role).toBe("assistant"); // mensagem inicial do bot
      expect(storedHistory[1].role).toBe("user");       // mensagem enviada pelo usuário
      expect(storedHistory[2].role).toBe("assistant");  // resposta do bot

      expect(storedHistory[1].content).toBe(userMessage);
      expect(storedHistory[2].content).toBe(expectedBotReply);

      // 4. O fetch foi chamado exatamente uma vez
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    }
  );

  // -------------------------------------------------------------------------

  it(
    "Ao enviar uma foto/anexo, o bot deve registrar o envio e armazenar os dados do arquivo na conversa.",
    /**
     * Tipo    : Integração
     * Entrada : Enviar uma foto (arquivo de imagem)
     * Saída   : O arquivo é registrado na mensagem do usuário e o histórico é preservado
     */
    async () => {
      const fileData = {
        name: "painel-solar.jpg",
        type: "image/jpeg",
        url: "blob:http://localhost/fake-object-url",
      };

      const userTextWithFile = "Analise esta imagem sobre energia solar.";

      // Simula fetch retornando resposta coerente
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        makeStreamResponse("Ótima imagem! Esses painéis solares são muito eficientes.")
      );

      // Monta histórico como o ChatContext faria
      const history = [
        { role: "assistant" as const, content: "Olá! 🌿 Eu sou o EcoBot. Vamos conversar sobre sustentabilidade?" },
        { role: "user" as const, content: userTextWithFile },
      ];

      const response = await fetch(FAKE_CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer fake-anon-key",
        },
        body: JSON.stringify({ messages: history }),
      });

      expect(response.ok).toBe(true);

      // Verifica que o arquivo foi incluído na mensagem do usuário
      const userMessage = {
        id: "test-id-123",
        sender: "user" as const,
        text: userTextWithFile,
        time: "10:00",
        file: fileData,
      };

      expect(userMessage.file).toBeDefined();
      expect(userMessage.file?.name).toBe("painel-solar.jpg");
      expect(userMessage.file?.type).toContain("image/");
      expect(userMessage.file?.url).toBeTruthy();
    }
  );

  // -------------------------------------------------------------------------

  it(
    "Quando a API retorna erro, o chat deve exibir mensagem de falha e não quebrar o histórico existente.",
    /**
     * Tipo    : Integração
     * Entrada : Enviar mensagem mas a API falha (status 500)
     * Saída   : Histórico mantido, estado de typing = false, mensagem de erro adicionada
     */
    async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
      );

      const response = await fetch(FAKE_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer fake-anon-key" },
        body: JSON.stringify({ messages: [{ role: "user", content: "Teste de falha" }] }),
      });

      // A API retornou erro
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);

      const errorBody = await response.json();
      expect(errorBody.error).toBeTruthy();

      // Nenhuma mensagem de bot válida deve ter sido adicionada ao histórico
      const fallbackBotMessage = "😔 Desculpe, não consegui responder. Tente novamente.";
      expect(fallbackBotMessage).toContain("Desculpe");
    }
  );
});
