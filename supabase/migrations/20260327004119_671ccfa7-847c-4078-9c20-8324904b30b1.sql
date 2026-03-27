
-- Create chatbot_conversations table
create table public.chatbot_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  message_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.chatbot_conversations enable row level security;

create policy "Users manage own conversations"
  on public.chatbot_conversations for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Create chatbot storage bucket
insert into storage.buckets (id, name, public) values ('chatbot', 'chatbot', false);

-- RLS policies for chatbot bucket
create policy "Users can upload own chat files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'chatbot' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can read own chat files"
  on storage.objects for select to authenticated
  using (bucket_id = 'chatbot' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update own chat files"
  on storage.objects for update to authenticated
  using (bucket_id = 'chatbot' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own chat files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'chatbot' and (storage.foldername(name))[1] = auth.uid()::text);
