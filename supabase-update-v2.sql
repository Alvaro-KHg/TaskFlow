-- Script complementar para executar no Editor SQL do Supabase
-- Roda após o supabase-setup.sql caso a tabela tasks já exista

-- 1. Adiciona suporte a listas de subtarefas complexas dentro de cada tarefa
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS checklist jsonb DEFAULT '[]'::jsonb;

-- 2. Adiciona suporte a histórico de comentários nos cartões
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS comments jsonb DEFAULT '[]'::jsonb;
