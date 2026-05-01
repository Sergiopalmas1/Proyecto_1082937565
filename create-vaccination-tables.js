/**
 * Script para crear las tablas de vacunación en Supabase
 * Ejecutar con: node create-vaccination-tables.js
 */

const { createClient } = require('@supabase/supabase-js');

// Configurar Supabase (usar variables de entorno)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Variables de entorno NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY requeridas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createVaccinationTables() {
  console.log('Creando tablas de vacunación...');

  try {
    // Crear tabla vaccine_types
    console.log('Creando vaccine_types...');
    const { error: vaccineTypesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS vaccine_types (
          id               UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
          name             VARCHAR(100) NOT NULL UNIQUE,
          description      TEXT,
          periodicity_days INTEGER      NOT NULL,
          is_mandatory     BOOLEAN      DEFAULT false,
          allowed_sex      VARCHAR(10)  CHECK (allowed_sex IS NULL OR allowed_sex IN ('macho','hembra')),
          is_active        BOOLEAN      DEFAULT true,
          created_at       TIMESTAMPTZ  DEFAULT NOW()
        );
      `
    });

    if (vaccineTypesError) {
      console.error('Error creando vaccine_types:', vaccineTypesError);
    } else {
      console.log('✅ vaccine_types creada');
    }

    // Crear tabla vaccinations
    console.log('Creando vaccinations...');
    const { error: vaccinationsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS vaccinations (
          id               UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
          cattle_id        UUID         NOT NULL REFERENCES cattle(id) ON DELETE CASCADE,
          vaccine_type_id  UUID         NOT NULL REFERENCES vaccine_types(id),
          vaccine_name     VARCHAR(150),
          applied_date     DATE         NOT NULL,
          dose             VARCHAR(30),
          next_dose_date   DATE,
          applied_by       UUID         REFERENCES auth.users(id) ON DELETE SET NULL,
          certificate_path TEXT,
          notes            TEXT,
          created_at       TIMESTAMPTZ  DEFAULT NOW()
        );
      `
    });

    if (vaccinationsError) {
      console.error('Error creando vaccinations:', vaccinationsError);
    } else {
      console.log('✅ vaccinations creada');
    }

    // Crear índices
    console.log('Creando índices...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_vacc_cattle ON vaccinations(cattle_id);
        CREATE INDEX IF NOT EXISTS idx_vacc_next_dose ON vaccinations(next_dose_date);
      `
    });

    if (indexError) {
      console.error('Error creando índices:', indexError);
    } else {
      console.log('✅ índices creados');
    }

    // Insertar catálogo inicial
    console.log('Insertando catálogo inicial de vacunas...');
    const vaccineTypes = [
      {
        name: 'Fiebre Aftosa',
        description: 'Vacuna obligatoria contra la fiebre aftosa',
        periodicity_days: 180,
        is_mandatory: true,
        allowed_sex: null,
      },
      {
        name: 'Brucelosis',
        description: 'Vacuna contra brucelosis bovina',
        periodicity_days: 365,
        is_mandatory: true,
        allowed_sex: 'hembra',
      },
      {
        name: 'Carbunco Sintomático',
        description: 'Vacuna contra carbunco sintomático',
        periodicity_days: 365,
        is_mandatory: false,
        allowed_sex: null,
      },
      {
        name: 'IBR/DVB',
        description: 'Vacuna contra rinotraqueitis infecciosa bovina y diarrea viral bovina',
        periodicity_days: 365,
        is_mandatory: false,
        allowed_sex: null,
      },
      {
        name: 'Rabia Bovina',
        description: 'Vacuna contra rabia bovina',
        periodicity_days: 365,
        is_mandatory: false,
        allowed_sex: null,
      },
    ];

    const { error: insertError } = await supabase
      .from('vaccine_types')
      .upsert(vaccineTypes, { onConflict: 'name' });

    if (insertError) {
      console.error('Error insertando catálogo:', insertError);
    } else {
      console.log('✅ catálogo de vacunas insertado');
    }

    console.log('🎉 Tablas de vacunación creadas exitosamente!');

  } catch (error) {
    console.error('Error general:', error);
    process.exit(1);
  }
}

createVaccinationTables();