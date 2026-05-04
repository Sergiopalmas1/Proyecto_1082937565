import { list, put, get } from '@vercel/blob';
import { HomeData, AppConfig } from './types';
import { HomeDataSchema, AppConfigSchema } from './validators';

/**
 * Función genérica para leer archivos JSON desde Vercel Blob
 * Requiere BLOB_READ_WRITE_TOKEN en variables de entorno
 */
export async function readJsonFile<T>(filename: string): Promise<T> {
  try {
    const blob = await get(filename, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!blob) {
      throw new Error(`Archivo no encontrado: ${filename}`);
    }

    const buffer = await blob.arrayBuffer();
    const text = new TextDecoder().decode(buffer);
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
      access: 'private',
      token: process.env.BLOB_READ_WRITE_TOKEN,
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
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return blobs.map(blob => blob.pathname);
  } catch (error) {
    console.error('Error listando archivos de Vercel Blob:', error);
    throw error;
  }
}
