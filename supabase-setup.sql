-- Script para executar no Editor SQL do seu projeto no Supabase

-- 1. Cria a tabela de Tarefas
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text,
  "dueDate" text,
  "assigneeId" text,
  status text,
  priority text,
  "taskType" text,
  tags text[],
  "hoursSpent" numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Cria a tabela de Links
CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Previne bloqueio de leitura/escrita para este grupo fechado (Desabilita RLS)
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE links DISABLE ROW LEVEL SECURITY;
