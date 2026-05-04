-- Migration: Add must_change_password to users
-- Ejecutar en la base de datos de Supabase del proyecto SIG Bovino

ALTER TABLE users
ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false;
