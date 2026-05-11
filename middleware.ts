/**
 * Middleware de Next.js
 * Protege rutas privadas y valida autenticación
 * 
 * NOTA: NO importar ningún paquete externo aquí (edge runtime no soporta Node.js APIs)
 * Usamos Web Crypto API nativa para verificar JWT.
 */

import { NextRequest, NextResponse } from 'next/server';

async function verifyToken(token: string): Promise<{ userId: string; email: string; role: string } | null> {
  try {
    const secret = process.env.SUPABASE_SIGBOVINO_SUPABASE_JWT_SECRET || process.env.JWT_SECRET || '';
    if (!secret) return null;

    // Decodificar JWT manualmente (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);

    // Importar clave HMAC
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Verificar firma
    const signatureInput = encoder.encode(`${parts[0]}.${parts[1]}`);
    const signature = Uint8Array.from(atob(parts[2].replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

    const valid = await crypto.subtle.verify('HMAC', key, signature, signatureInput);
    if (!valid) return null;

    // Decodificar payload
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    // Verificar expiración
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Rutas que requieren autenticación
    const protectedRoutes = ['/dashboard', '/admin', '/cattle', '/sheds', '/milk', '/vaccinations', '/reproduction', '/reports'];

    // Verificar si es una ruta protegida
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isProtectedRoute) {
      const token = request.cookies.get('sig-bovino-session')?.value;

      if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }

      const payload = await verifyToken(token);
      if (!payload) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
      }

      if (pathname.startsWith('/admin') && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|setup-database).*)',
  ],
};
