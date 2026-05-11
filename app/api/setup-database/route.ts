import { NextResponse } from 'next/server';
import { requireSupabaseClient, executeSql } from '@/lib/supabase';

// ============================================
// GET — Verificar conexión y listar tablas
// ============================================
export async function GET() {
  try {
    const supabase = requireSupabaseClient();

    // Listar tablas existentes en schema public
    const { data: tablesRaw, error: tablesError } = await supabase
      .rpc('get_table_info')
      .select('*');

    // Si la función RPC no existe, intentar con query directa
    let tables: Record<string, number> = {};

    if (tablesError) {
      // Fallback: consultar tablas conocidas una por una
      const knownTables = [
        'users', 'sheds', 'cattle', 'cattle_audit',
        'milk_production', 'production_alerts',
        'vaccine_types', 'vaccinations', 'reproductive_events',
      ];

      for (const tableName of knownTables) {
        try {
          const { count, error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });

          if (!error) {
            tables[tableName] = count ?? 0;
          }
        } catch {
          // Tabla no existe, skip
        }
      }
    } else {
      for (const row of tablesRaw || []) {
        tables[row.table_name] = row.row_count ?? 0;
      }
    }

    return NextResponse.json({
      connected: true,
      tables,
      tableCount: Object.keys(tables).length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { connected: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// POST — Crear tablas
// ============================================

const TABLE_DEFINITIONS: { name: string; sql: string }[] = [
  {
    name: 'users',
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'operario' CHECK (role IN ('admin', 'veterinario', 'operario')),
        is_active BOOLEAN NOT NULL DEFAULT true,
        must_change_password BOOLEAN NOT NULL DEFAULT false,
        last_login_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      ALTER TABLE users ENABLE ROW LEVEL SECURITY;

      DO $$ BEGIN
        CREATE POLICY service_role_all ON users FOR ALL TO service_role USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
    `,
  },
  {
    name: 'sheds',
    sql: `
      CREATE TABLE IF NOT EXISTS sheds (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'otro' CHECK (type IN ('pastizal', 'establo', 'corral', 'enfermería', 'parto', 'otro')),
        surface_m2 NUMERIC,
        max_capacity INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      ALTER TABLE sheds ENABLE ROW LEVEL SECURITY;

      DO $$ BEGIN
        CREATE POLICY service_role_all ON sheds FOR ALL TO service_role USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      CREATE INDEX IF NOT EXISTS idx_sheds_is_active ON sheds (is_active);
    `,
  },
  {
    name: 'cattle',
    sql: `
      CREATE TABLE IF NOT EXISTS cattle (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT NOT NULL UNIQUE,
        name TEXT,
        sex TEXT NOT NULL CHECK (sex IN ('macho', 'hembra')),
        birth_date DATE NOT NULL,
        breed TEXT,
        color TEXT,
        weight_kg NUMERIC,
        shed_id UUID REFERENCES sheds(id),
        status TEXT NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'baja', 'vendido', 'muerto')),
        status_reason TEXT,
        status_date DATE,
        dam_id UUID REFERENCES cattle(id),
        sire_id UUID REFERENCES cattle(id),
        estimated_value NUMERIC,
        photo_path TEXT,
        notes TEXT,
        created_by UUID REFERENCES users(id),
        updated_by UUID REFERENCES users(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      ALTER TABLE cattle ENABLE ROW LEVEL SECURITY;

      DO $$ BEGIN
        CREATE POLICY service_role_all ON cattle FOR ALL TO service_role USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      CREATE INDEX IF NOT EXISTS idx_cattle_code ON cattle (code);
      CREATE INDEX IF NOT EXISTS idx_cattle_status ON cattle (status);
      CREATE INDEX IF NOT EXISTS idx_cattle_shed_id ON cattle (shed_id);
      CREATE INDEX IF NOT EXISTS idx_cattle_sex ON cattle (sex);
      CREATE INDEX IF NOT EXISTS idx_cattle_dam_id ON cattle (dam_id);
      CREATE INDEX IF NOT EXISTS idx_cattle_sire_id ON cattle (sire_id);
    `,
  },
  {
    name: 'cattle_audit',
    sql: `
      CREATE TABLE IF NOT EXISTS cattle_audit (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cattle_id UUID NOT NULL REFERENCES cattle(id) ON DELETE CASCADE,
        action TEXT NOT NULL CHECK (action IN ('create', 'update', 'status_change', 'delete')),
        changes JSONB NOT NULL DEFAULT '{}',
        changed_by UUID REFERENCES users(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      ALTER TABLE cattle_audit ENABLE ROW LEVEL SECURITY;

      DO $$ BEGIN
        CREATE POLICY service_role_all ON cattle_audit FOR ALL TO service_role USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      CREATE INDEX IF NOT EXISTS idx_cattle_audit_cattle_id ON cattle_audit (cattle_id);
      CREATE INDEX IF NOT EXISTS idx_cattle_audit_action ON cattle_audit (action);
      CREATE INDEX IF NOT EXISTS idx_cattle_audit_created_at ON cattle_audit (created_at DESC);
    `,
  },
  {
    name: 'milk_production',
    sql: `
      CREATE TABLE IF NOT EXISTS milk_production (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cattle_id UUID NOT NULL REFERENCES cattle(id) ON DELETE CASCADE,
        production_date DATE NOT NULL,
        shift TEXT NOT NULL CHECK (shift IN ('mañana', 'tarde')),
        liters NUMERIC NOT NULL CHECK (liters >= 0 AND liters <= 60),
        recorded_by UUID REFERENCES users(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE (cattle_id, production_date, shift)
      );

      ALTER TABLE milk_production ENABLE ROW LEVEL SECURITY;

      DO $$ BEGIN
        CREATE POLICY service_role_all ON milk_production FOR ALL TO service_role USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      CREATE INDEX IF NOT EXISTS idx_milk_production_cattle_id ON milk_production (cattle_id);
      CREATE INDEX IF NOT EXISTS idx_milk_production_date ON milk_production (production_date DESC);
      CREATE INDEX IF NOT EXISTS idx_milk_production_cattle_date ON milk_production (cattle_id, production_date DESC);
    `,
  },
  {
    name: 'production_alerts',
    sql: `
      CREATE TABLE IF NOT EXISTS production_alerts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cattle_id UUID NOT NULL REFERENCES cattle(id) ON DELETE CASCADE,
        production_id UUID REFERENCES milk_production(id),
        alert_type TEXT NOT NULL DEFAULT 'production_drop' CHECK (alert_type IN ('production_drop')),
        current_liters NUMERIC NOT NULL,
        average_liters NUMERIC NOT NULL,
        drop_percentage NUMERIC NOT NULL,
        is_resolved BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      ALTER TABLE production_alerts ENABLE ROW LEVEL SECURITY;

      DO $$ BEGIN
        CREATE POLICY service_role_all ON production_alerts FOR ALL TO service_role USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      CREATE INDEX IF NOT EXISTS idx_production_alerts_cattle_id ON production_alerts (cattle_id);
      CREATE INDEX IF NOT EXISTS idx_production_alerts_is_resolved ON production_alerts (is_resolved);
    `,
  },
  {
    name: 'vaccine_types',
    sql: `
      CREATE TABLE IF NOT EXISTS vaccine_types (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        periodicity_days INTEGER NOT NULL DEFAULT 0,
        is_mandatory BOOLEAN NOT NULL DEFAULT false,
        allowed_sex TEXT CHECK (allowed_sex IS NULL OR allowed_sex IN ('macho', 'hembra')),
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      ALTER TABLE vaccine_types ENABLE ROW LEVEL SECURITY;

      DO $$ BEGIN
        CREATE POLICY service_role_all ON vaccine_types FOR ALL TO service_role USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      CREATE INDEX IF NOT EXISTS idx_vaccine_types_is_active ON vaccine_types (is_active);
    `,
  },
  {
    name: 'vaccinations',
    sql: `
      CREATE TABLE IF NOT EXISTS vaccinations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cattle_id UUID NOT NULL REFERENCES cattle(id) ON DELETE CASCADE,
        vaccine_type_id UUID NOT NULL REFERENCES vaccine_types(id),
        vaccine_name TEXT NOT NULL,
        applied_date DATE NOT NULL,
        dose TEXT,
        next_dose_date DATE,
        applied_by UUID REFERENCES users(id),
        certificate_path TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;

      DO $$ BEGIN
        CREATE POLICY service_role_all ON vaccinations FOR ALL TO service_role USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      CREATE INDEX IF NOT EXISTS idx_vaccinations_cattle_id ON vaccinations (cattle_id);
      CREATE INDEX IF NOT EXISTS idx_vaccinations_vaccine_type_id ON vaccinations (vaccine_type_id);
      CREATE INDEX IF NOT EXISTS idx_vaccinations_applied_date ON vaccinations (applied_date DESC);
      CREATE INDEX IF NOT EXISTS idx_vaccinations_next_dose_date ON vaccinations (next_dose_date);
    `,
  },
  {
    name: 'reproductive_events',
    sql: `
      CREATE TABLE IF NOT EXISTS reproductive_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        cattle_id UUID NOT NULL REFERENCES cattle(id) ON DELETE CASCADE,
        event_type TEXT NOT NULL CHECK (event_type IN ('celo', 'preñez', 'parto', 'lactancia', 'vacía')),
        event_date DATE NOT NULL,
        expected_birth DATE,
        notes TEXT,
        registered_by UUID REFERENCES users(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      ALTER TABLE reproductive_events ENABLE ROW LEVEL SECURITY;

      DO $$ BEGIN
        CREATE POLICY service_role_all ON reproductive_events FOR ALL TO service_role USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;

      CREATE INDEX IF NOT EXISTS idx_reproductive_events_cattle_id ON reproductive_events (cattle_id);
      CREATE INDEX IF NOT EXISTS idx_reproductive_events_event_type ON reproductive_events (event_type);
      CREATE INDEX IF NOT EXISTS idx_reproductive_events_event_date ON reproductive_events (event_date DESC);
    `,
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action !== 'create-all') {
      return NextResponse.json(
        { error: 'Acción no válida. Usa { action: "create-all" }' },
        { status: 400 }
      );
    }

    const results: { name: string; status: 'ok' | 'error'; error?: string }[] = [];

    for (const table of TABLE_DEFINITIONS) {
      try {
        await executeSql(table.sql);
        results.push({ name: table.name, status: 'ok' });
      } catch (error: any) {
        results.push({ name: table.name, status: 'error', error: error.message });
      }
    }

    // NOTIFY pgrst para que PostgREST recargue el schema
    try {
      await executeSql("NOTIFY pgrst, 'reload schema';");
    } catch (error: any) {
      results.push({ name: 'NOTIFY pgrst', status: 'error', error: error.message });
    }

    const allOk = results.every((r) => r.status === 'ok');

    return NextResponse.json({
      success: allOk,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
