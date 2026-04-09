import fs from 'fs';
import path from 'path';
import { HomeData, AppConfig } from './types';
import { HomeDataSchema, AppConfigSchema } from './validators';

/**
 * Función genérica para leer archivos JSON desde el servidor
 * Solo debe ser usada en Server Components o Route Handlers
 */
export function readJsonFile<T>(filename: string): T {
  const filePath = path.join(process.cwd(), 'data', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

/**
 * Lee y valida home.json
 * Retorna HomeData tipado y validado contra HomeDataSchema
 */
export function readHomeData(): HomeData {
  const raw = readJsonFile<unknown>('home.json');
  const validated = HomeDataSchema.parse(raw);
  return validated;
}

/**
 * Lee y valida config.json
 * Retorna AppConfig tipado y validado contra AppConfigSchema
 */
export function readAppConfig(): AppConfig {
  const raw = readJsonFile<unknown>('config.json');
  const validated = AppConfigSchema.parse(raw);
  return validated;
}
