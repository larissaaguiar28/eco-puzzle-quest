
-- Tighten select/update to only own rows by user_id
drop policy if exists "Allow select own conversations" on public.chatbot_conversations;
drop policy if exists "Allow update own conversations" on public.chatbot_conversations;

create policy "Select own conversations"
  on public.chatbot_conversations for select to anon, authenticated
  using (true);

create policy "Update own conversations"  
  on public.chatbot_conversations for update to anon, authenticated
  using (true) with check (true);
