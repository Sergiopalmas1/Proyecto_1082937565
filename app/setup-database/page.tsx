'use client';

import { useState } from 'react';

interface TableInfo {
  [tableName: string]: number;
}

interface ConnectionResult {
  connected: boolean;
  tables?: TableInfo;
  tableCount?: number;
  error?: string;
}

interface CreateResult {
  success: boolean;
  results?: { name: string; status: 'ok' | 'error'; error?: string }[];
  error?: string;
}

export default function SetupDatabasePage() {
  const [connectionResult, setConnectionResult] = useState<ConnectionResult | null>(null);
  const [createResult, setCreateResult] = useState<CreateResult | null>(null);
  const [loadingConnection, setLoadingConnection] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  async function testConnection() {
    setLoadingConnection(true);
    setConnectionResult(null);
    try {
      const res = await fetch('/api/setup-database');
      const data = await res.json();
      setConnectionResult(data);
    } catch (error: any) {
      setConnectionResult({ connected: false, error: error.message });
    } finally {
      setLoadingConnection(false);
    }
  }

  async function createTables() {
    setLoadingCreate(true);
    setCreateResult(null);
    try {
      const res = await fetch('/api/setup-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-all' }),
      });
      const data = await res.json();
      setCreateResult(data);
    } catch (error: any) {
      setCreateResult({ success: false, error: error.message });
    } finally {
      setLoadingCreate(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>🛠 Setup Database</h1>
      <p style={{ color: '#666', marginBottom: 32, fontSize: 14 }}>
        Página temporal para configurar las tablas en Supabase. Eliminar después del setup.
      </p>

      {/* Sección 1: Test de Conexión */}
      <section style={{ marginBottom: 32, padding: 20, border: '1px solid #e0e0e0', borderRadius: 8, background: '#fafafa' }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>1. Test de Conexión</h2>
        <button
          onClick={testConnection}
          disabled={loadingConnection}
          style={{
            padding: '10px 20px',
            background: loadingConnection ? '#999' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: loadingConnection ? 'not-allowed' : 'pointer',
            fontSize: 14,
          }}
        >
          {loadingConnection ? (
            <span>⏳ Probando conexión...</span>
          ) : (
            'Probar Conexión'
          )}
        </button>

        {connectionResult && (
          <div style={{ marginTop: 16 }}>
            {connectionResult.connected ? (
              <>
                <div style={{ padding: 12, background: '#dcfce7', borderRadius: 6, color: '#166534', marginBottom: 12 }}>
                  ✅ Conexión exitosa — {connectionResult.tableCount} tabla(s) encontrada(s)
                </div>
                {connectionResult.tables && Object.keys(connectionResult.tables).length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9' }}>
                        <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #e0e0e0' }}>Tabla</th>
                        <th style={{ textAlign: 'right', padding: '8px 12px', borderBottom: '1px solid #e0e0e0' }}>Filas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(connectionResult.tables).map(([name, count]) => (
                        <tr key={name}>
                          <td style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', fontFamily: 'monospace' }}>{name}</td>
                          <td style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0', textAlign: 'right' }}>{count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: 12, background: '#fef9c3', borderRadius: 6, color: '#854d0e' }}>
                    ⚠️ No se encontraron tablas. Usa el botón de abajo para crearlas.
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: 12, background: '#fecaca', borderRadius: 6, color: '#991b1b' }}>
                ❌ Error de conexión
                <pre style={{ marginTop: 8, fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {connectionResult.error}
                </pre>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Sección 2: Crear Tablas */}
      <section style={{ padding: 20, border: '1px solid #e0e0e0', borderRadius: 8, background: '#fafafa' }}>
        <h2 style={{ fontSize: 18, marginBottom: 12 }}>2. Crear Tablas</h2>
        <p style={{ color: '#666', fontSize: 13, marginBottom: 12 }}>
          Crea todas las tablas necesarias: users, sheds, cattle, cattle_audit, milk_production,
          production_alerts, vaccine_types, vaccinations, reproductive_events.
        </p>
        <button
          onClick={createTables}
          disabled={loadingCreate}
          style={{
            padding: '10px 20px',
            background: loadingCreate ? '#999' : '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: loadingCreate ? 'not-allowed' : 'pointer',
            fontSize: 14,
          }}
        >
          {loadingCreate ? (
            <span>⏳ Creando tablas...</span>
          ) : (
            'Crear Todas las Tablas'
          )}
        </button>

        {createResult && (
          <div style={{ marginTop: 16 }}>
            {createResult.error && !createResult.results ? (
              <div style={{ padding: 12, background: '#fecaca', borderRadius: 6, color: '#991b1b' }}>
                ❌ Error general
                <pre style={{ marginTop: 8, fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {createResult.error}
                </pre>
              </div>
            ) : (
              <>
                <div
                  style={{
                    padding: 12,
                    background: createResult.success ? '#dcfce7' : '#fef9c3',
                    borderRadius: 6,
                    color: createResult.success ? '#166534' : '#854d0e',
                    marginBottom: 12,
                  }}
                >
                  {createResult.success
                    ? '✅ Todas las tablas creadas correctamente'
                    : '⚠️ Algunas tablas tuvieron errores'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {createResult.results?.map((r) => (
                    <div
                      key={r.name}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 4,
                        background: r.status === 'ok' ? '#f0fdf4' : '#fef2f2',
                        border: `1px solid ${r.status === 'ok' ? '#bbf7d0' : '#fecaca'}`,
                        fontSize: 14,
                      }}
                    >
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {r.status === 'ok' ? '✅' : '❌'} {r.name}
                      </span>
                      {r.error && (
                        <pre style={{ marginTop: 4, fontSize: 12, color: '#991b1b', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                          {r.error}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
