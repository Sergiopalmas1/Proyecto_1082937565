/**
 * Middleware de Next.js
 * Protege rutas privadas verificando que exista cookie de sesión.
 * La validación completa del JWT se hace en los API routes (withAuth).
 */

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/admin', '/cattle', '/sheds', '/milk', '/vaccinations', '/reproduction', '/reports'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    const token = request.cookies.get('sig-bovino-session')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|setup-database).*)',
  ],
};
