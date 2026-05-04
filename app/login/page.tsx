'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        setLoading(false);
        return;
      }

      if (data.user?.must_change_password) {
        router.push('/change-password');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#F5EFE0' }}>
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
        {/* Silueta de pastizal */}
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,100 Q150,80 300,100 T600,100 T900,100 T1200,100 L1200,200 L0,200 Z"
            fill="#2D5016"
          />
        </svg>
      </div>

      {/* Card container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div
          className="rounded-xl shadow-lg p-8 border-t-4"
          style={{
            backgroundColor: '#FAF7F2',
            borderColor: '#2D5016',
          }}
        >
          {/* Logo y título */}
          <div className="text-center mb-8">
            {/* Logo SVG de cabeza de res estilizada */}
            <svg
              className="w-14 h-14 mx-auto mb-4"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke="#2D5016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Cara */}
                <path d="M28 8 L38 14 L38 34 Q38 42 28 42 Q18 42 18 34 L18 14 Z" />
                {/* Ojos */}
                <circle cx="24" cy="22" r="2" fill="#2D5016" />
                <circle cx="32" cy="22" r="2" fill="#2D5016" />
                {/* Hocico */}
                <ellipse cx="28" cy="30" rx="3" ry="4" />
                {/* Orejas */}
                <path d="M22 12 L20 6 L22 10" />
                <path d="M34 12 L36 6 L34 10" />
                {/* Cuernos */}
                <path d="M20 6 Q16 2 14 2" />
                <path d="M36 6 Q40 2 42 2" />
              </g>
            </svg>

            <h1 className="text-3xl font-bold mb-1" style={{ color: '#1F3A0D' }}>
              SIG Bovino
            </h1>
            <p className="text-sm" style={{ color: '#6B5635' }}>
              Control completo de su hato ganadero.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1" style={{ color: '#2C2416' }}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-2 transition"
                style={{
                  borderColor: '#D4C7B0',
                  '--tw-ring-color': '#2D5016',
                  color: '#2C2416',
                } as any}
                placeholder="tu@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1" style={{ color: '#2C2416' }}>
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-2 transition"
                style={{
                  borderColor: '#D4C7B0',
                  '--tw-ring-color': '#2D5016',
                  color: '#2C2416',
                } as any}
                placeholder="••••••••"
              />
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded bg-red-50 border border-red-200"
              >
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg text-white font-medium transition-colors mt-6"
              style={{
                backgroundColor: loading ? '#8B6F47' : '#2D5016',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#1F3A0D';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#2D5016';
                }
              }}
            >
              {loading ? 'Ingresando...' : 'Ingresar al sistema'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-center mt-6" style={{ color: '#6B5635' }}>
            Sistema de Inventario Bovino — v2.1
          </p>
        </div>
      </motion.div>
    </div>
  );
}
