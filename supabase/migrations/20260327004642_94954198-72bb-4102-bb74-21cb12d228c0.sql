
-- Drop existing policy
drop policy if exists "Users manage own conversations" on public.chatbot_conversations;

-- Allow anon role too (since auth is on external project)
create policy "Allow insert conversations"
  on public.chatbot_conversations for insert to anon, authenticated
  with check (true);

create policy "Allow select own conversations"
  on public.chatbot_conversations for select to anon, authenticated
  using (true);

create policy "Allow update own conversations"
  on public.chatbot_conversations for update to anon, authenticated
  using (true) with check (true);
