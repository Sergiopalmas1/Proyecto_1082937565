/**
 * Funciones de autenticación y manejo de sesiones
 * SIG Bovino - Fase 1
 */

import * as bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { SafeUser, JWTPayload, UserRole } from './types';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'sig-bovino-session';
const JWT_EXPIRATION = '24h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no configurada en variables de entorno');
}

const secret = new TextEncoder().encode(JWT_SECRET);

// ============================================
// HASH Y VERIFICACIÓN DE CONTRASEÑAS
// ============================================

/**
 * Hash de contraseña con bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verificar contraseña
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============================================
// JWT
// ============================================

/**
 * Crear JWT
 */
export async function createJWT(
  userId: string,
  email: string,
  role: UserRole
): Promise<string> {
  const token = await new SignJWT({
    userId,
    email,
    role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(secret);

  return token;
}

/**
 * Verificar y decodificar JWT
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

// ============================================
// COOKIES
// ============================================

/**
 * Establecer cookie de sesión (HttpOnly, Secure, SameSite)
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 horas
    path: '/',
  });
}

/**
 * Obtener token de la cookie
 */
export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  return cookie?.value || null;
}

/**
 * Eliminar cookie de sesión
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Obtener usuario actual de la cookie
 */
export async function getCurrentUser(): Promise<SafeUser | null> {
  const token = await getTokenFromCookie();
  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload) {
    // Token inválido, limpiar cookie
    await clearSessionCookie();
    return null;
  }

  return {
    id: payload.userId,
    email: payload.email,
    role: payload.role,
    name: '', // Se rellena desde la base de datos
    is_active: true,
  };
}

/**
 * Generar contraseña aleatoria temporal
 * Usado en Fase 9 cuando admin crea usuario
 */
export function generateTemporaryPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
