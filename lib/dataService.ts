import { list, put, getDownloadUrl } from '@vercel/blob';
import { HomeData, AppConfig } from './types';
import { HomeDataSchema, AppConfigSchema } from './validators';

// Prefer the project-specific token name; fallback to generic name for backwards compatibility
const BLOB_TOKEN = process.env.BLOB_SIGBOVINO_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;


/**
 * Función genérica para leer archivos JSON desde Vercel Blob
 * Requiere BLOB_READ_WRITE_TOKEN en variables de entorno
 */
export async function readJsonFile<T>(filename: string): Promise<T> {
  try {
    // Buscar el blob por nombre y obtener URL de descarga
    const { blobs } = await list({
      prefix: filename,
      token: BLOB_TOKEN,
    });

    const blob = blobs.find(b => b.pathname === filename);
    if (!blob) {
      throw new Error(`Archivo no encontrado: ${filename}`);
    }

    const url = getDownloadUrl(blob.url);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error descargando ${filename}: ${res.status}`);
    const text = await res.text();
    return JSON.parse(text) as T;
  } catch (error) {
    console.error(`Error leyendo ${filename} desde Vercel Blob:`, error);
    throw error;
  }
}

/**
 * Función genérica para escribir archivos JSON en Vercel Blob
 * Requiere BLOB_READ_WRITE_TOKEN en variables de entorno
 */
export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await put(filename, jsonString, {
      access: 'public',
      token: BLOB_TOKEN,
      contentType: 'application/json',
    });
  } catch (error) {
    console.error(`Error escribiendo ${filename} en Vercel Blob:`, error);
    throw error;
  }
}

/**
 * Lee y valida home.json
 * Retorna HomeData tipado y validado contra HomeDataSchema
 */
export async function readHomeData(): Promise<HomeData> {
  const raw = await readJsonFile<unknown>('home.json');
  const validated = HomeDataSchema.parse(raw);
  return validated;
}

/**
 * Escribe y valida home.json
 * Valida los datos antes de persistir en Vercel Blob
 */
export async function writeHomeData(data: unknown): Promise<void> {
  const validated = HomeDataSchema.parse(data);
  await writeJsonFile('home.json', validated);
}

/**
 * Lee y valida config.json
 * Retorna AppConfig tipado y validado contra AppConfigSchema
 */
export async function readAppConfig(): Promise<AppConfig> {
  const raw = await readJsonFile<unknown>('config.json');
  const validated = AppConfigSchema.parse(raw);
  return validated;
}

/**
 * Escribe y valida config.json
 * Valida los datos antes de persistir en Vercel Blob
 */
export async function writeAppConfig(data: unknown): Promise<void> {
  const validated = AppConfigSchema.parse(data);
  await writeJsonFile('config.json', validated);
}

/**
 * Lista todos los archivos en Vercel Blob (opcional para debug)
 */
export async function listBlobFiles(): Promise<string[]> {
  try {
    const { blobs } = await list({
      token: BLOB_TOKEN,
    });
    return blobs.map(blob => blob.pathname);
  } catch (error) {
    console.error('Error listando archivos de Vercel Blob:', error);
    throw error;
  }
}
