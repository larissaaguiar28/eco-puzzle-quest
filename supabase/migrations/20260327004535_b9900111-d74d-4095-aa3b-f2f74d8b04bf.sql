
-- Add messages jsonb column and make storage_path optional
alter table public.chatbot_conversations 
  add column messages jsonb not null default '[]'::jsonb,
  alter column storage_path drop not null,
  alter column storage_path set default null;
