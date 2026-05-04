/**
 * Script de Seed para Vercel Blob
 * 
 * Migra datos JSON locales a Vercel Blob Storage
 * 
 * Uso:
 *   npx ts-node scripts/seed-blob.ts
 * 
 * Requisitos:
 *   - BLOB_READ_WRITE_TOKEN en .env.local
 *   - Archivos data/home.json y data/config.json
 */

import { writeHomeData, writeAppConfig } from '../lib/dataService';
import fs from 'fs';
import path from 'path';

// Verificar que el token está disponible
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('❌ Error: BLOB_READ_WRITE_TOKEN no está definido en .env.local');
  process.exit(1);
}

async function seedBlob() {
  console.log('🌱 Iniciando seed a Vercel Blob...\n');

  try {
    // Leer archivos locales
    const homeLocalPath = path.join('data', 'home.json');
    const configLocalPath = path.join('data', 'config.json');

    console.log(`📂 Leyendo home.json desde: ${homeLocalPath}`);
    if (!fs.existsSync(homeLocalPath)) {
      throw new Error(`Archivo no encontrado: ${homeLocalPath}`);
    }
    const homeData = JSON.parse(fs.readFileSync(homeLocalPath, 'utf-8'));
    console.log(`   ✅ home.json leído (${Object.keys(homeData).length} campos)`);

    console.log(`📂 Leyendo config.json desde: ${configLocalPath}`);
    if (!fs.existsSync(configLocalPath)) {
      throw new Error(`Archivo no encontrado: ${configLocalPath}`);
    }
    const configData = JSON.parse(fs.readFileSync(configLocalPath, 'utf-8'));
    console.log(`   ✅ config.json leído (${Object.keys(configData).length} campos)`);

    // Escribir a Vercel Blob
    console.log('\n📤 Subiendo a Vercel Blob...');

    console.log('   Escribiendo home.json...');
    await writeHomeData(homeData);
    console.log('   ✅ home.json guardado en Vercel Blob');

    console.log('   Escribiendo config.json...');
    await writeAppConfig(configData);
    console.log('   ✅ config.json guardado en Vercel Blob');

    console.log('\n✅ Migración completada exitosamente!\n');
    console.log('📊 Datos migrados:');
    console.log('   • home.json');
    console.log('   • config.json');
    console.log('\n💡 Verifica en: https://vercel.com/account/storage');

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`\n❌ Error durante migración: ${message}\n`);
    process.exit(1);
  }
}

// Ejecutar seed
seedBlob().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
