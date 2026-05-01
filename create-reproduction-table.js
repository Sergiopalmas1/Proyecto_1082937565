/**
 * Script para crear la tabla de eventos reproductivos en Supabase
 * Ejecutar con: node create-reproduction-table.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Variables de entorno NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY requeridas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createReproductiveTable() {
  console.log('Creando tabla reproductive_events con validaciones completas...');

  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Crear tabla reproductive_events
        CREATE TABLE IF NOT EXISTS reproductive_events (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          cattle_id UUID NOT NULL REFERENCES cattle(id) ON DELETE CASCADE,
          event_type TEXT NOT NULL CHECK (event_type IN ('celo', 'preñez', 'parto', 'lactancia', 'vacía')),
          event_date DATE NOT NULL,
          expected_birth DATE,
          notes TEXT,
          registered_by UUID NOT NULL REFERENCES auth.users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

          -- Validación: expected_birth solo para eventos de preñez
          CONSTRAINT expected_birth_only_for_pregnancy
            CHECK ((event_type = 'preñez' AND expected_birth IS NOT NULL) OR
                   (event_type != 'preñez' AND expected_birth IS NULL)),

          -- Validación: expected_birth debe ser posterior a event_date
          CONSTRAINT expected_birth_after_event_date
            CHECK (expected_birth IS NULL OR expected_birth > event_date)
        );

        -- Índices para optimización
        CREATE INDEX IF NOT EXISTS idx_reproductive_events_cattle_id ON reproductive_events(cattle_id);
        CREATE INDEX IF NOT EXISTS idx_reproductive_events_event_type ON reproductive_events(event_type);
        CREATE INDEX IF NOT EXISTS idx_reproductive_events_event_date ON reproductive_events(event_date DESC);
        CREATE INDEX IF NOT EXISTS idx_reproductive_events_expected_birth ON reproductive_events(expected_birth);

        -- Índice compuesto para deducción de estado (último evento por animal)
        CREATE INDEX IF NOT EXISTS idx_reproductive_events_cattle_date
          ON reproductive_events(cattle_id, event_date DESC, created_at DESC);

        -- Trigger para updated_at
        CREATE OR REPLACE FUNCTION update_reproductive_events_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS trigger_reproductive_events_updated_at ON reproductive_events;
        CREATE TRIGGER trigger_reproductive_events_updated_at
          BEFORE UPDATE ON reproductive_events
          FOR EACH ROW EXECUTE FUNCTION update_reproductive_events_updated_at();

        -- Políticas RLS (Row Level Security)
        ALTER TABLE reproductive_events ENABLE ROW LEVEL SECURITY;

        -- Política para que solo admin y veterinario puedan gestionar eventos
        DROP POLICY IF EXISTS "Reproductive events access policy" ON reproductive_events;
        CREATE POLICY "Reproductive events access policy" ON reproductive_events
          FOR ALL USING (
            EXISTS (
              SELECT 1 FROM user_profiles
              WHERE user_profiles.user_id = auth.uid()
              AND user_profiles.role IN ('admin', 'veterinario')
            )
          );
      `,
    });

    if (error) {
      console.error('Error creando tabla reproductive_events:', error);
      process.exit(1);
    }

    console.log('✅ Tabla reproductive_events creada con validaciones completas.');

    // Verificar que la tabla se creó correctamente
    const { data, error: verifyError } = await supabase
      .from('reproductive_events')
      .select('id')
      .limit(1);

    if (verifyError) {
      console.error('Error verificando tabla:', verifyError);
    } else {
      console.log('✅ Verificación exitosa: tabla reproductive_events está operativa');
    }

  } catch (err) {
    console.error('Error general:', err);
    process.exit(1);
  }
}

createReproductiveTable();
