

## Plano: Persistir conversas do EcoBot no banco de dados + Storage

### Resumo
Criar uma tabela `chatbot_conversations` no banco de dados para armazenar metadados de cada conversa, e um bucket no Storage (`chatbot`) para salvar o JSON completo das mensagens. A tabela guarda o `user_id`, timestamps e a URL do arquivo JSON no Storage.

### 1. Criar bucket de Storage `chatbot`
Migration SQL para criar o bucket e políticas RLS permitindo que usuários autenticados façam upload/leitura dos seus próprios arquivos.

### 2. Criar tabela `chatbot_conversations`
```sql
create table public.chatbot_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  message_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.chatbot_conversations enable row level security;
-- Users can only see/manage their own conversations
create policy "Users manage own conversations"
  on public.chatbot_conversations for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
```

### 3. Atualizar `ChatContext.tsx`
- Importar `supabase` client e `useAuth` para obter `user.id`.
- Adicionar estado `conversationId` para rastrear a conversa atual.
- **Função `saveConversation`**: Após cada resposta completa do bot (no `finally` do `sendMessage`), serializar `messages` como JSON, fazer upload para `chatbot/{user_id}/{conversation_id}.json` via `supabase.storage`, e fazer upsert na tabela `chatbot_conversations` com o `storage_path` e `message_count`.
- **No `clearChat`**: Salvar a conversa atual antes de limpar, e criar um novo `conversationId`.
- **Na inicialização**: Carregar a última conversa do usuário (se existir) buscando o JSON do Storage.

### 4. Atualizar `ChatProvider` no `HomeLayout.tsx`
O `ChatProvider` precisa estar dentro do `AuthProvider` para ter acesso ao usuário. Verificar que a hierarquia está correta (já parece estar, pois `AuthProvider` provavelmente envolve o app todo).

### Detalhes técnicos
- O arquivo JSON no Storage terá o formato: `chatbot/{user_id}/{conversation_id}.json`
- O upload usa `supabase.storage.from('chatbot').upload(path, blob, { upsert: true })`
- A URL pública é obtida via `supabase.storage.from('chatbot').getPublicUrl(path)`
- O save é debounced (salva após 2s de inatividade) para não sobrecarregar com uploads a cada token do streaming
- Bucket com RLS: usuários só acessam pasta com seu próprio `user_id`

