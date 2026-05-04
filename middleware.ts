/**
 * Middleware de Next.js
 * Protege rutas privadas y valida autenticación
 * También valida roles específicos para /admin/*
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromCookie, verifyJWT } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/admin', '/cattle', '/sheds', '/milk', '/vaccinations', '/reproduction', '/reports'];

  // Verificar si es una ruta protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Verificar si hay cookie de sesión
    const token = request.cookies.get('sig-bovino-session')?.value;

    if (!token) {
      // Sin sesión, redirigir a login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verificar si el token es válido
    const payload = await verifyJWT(token);
    if (!payload) {
      // Token inválido o expirado
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Validar rol específico para /admin
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      // No es admin, redirigir a dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Ruta pública, continuar
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Proteger todas las rutas excepto:
     * - api (api routes son manejadas por withAuth/withRole)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (favicon)
     * - /login (público)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
