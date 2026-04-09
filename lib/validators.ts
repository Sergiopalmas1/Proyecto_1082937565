import { z } from 'zod';

// Schema de validación para HomeData
export const HomeDataSchema = z.object({
  hero: z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
    description: z.string().min(1, 'Description is required'),
    animationStyle: z.enum(['typewriter', 'fadeIn', 'slideUp']),
  }),
  meta: z.object({
    pageTitle: z.string().min(1, 'Page title is required'),
    description: z.string().min(1, 'Meta description is required'),
  }),
});

// Schema de validación para AppConfig
export const AppConfigSchema = z.object({
  appName: z.string().min(1, 'App name is required'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semantic'),
  locale: z.string().min(2, 'Locale is required'),
  theme: z.enum(['light', 'dark']),
});

// Tipos inferidos de Zod (opcional pero recomendado)
export type HomeDataValidated = z.infer<typeof HomeDataSchema>;
export type AppConfigValidated = z.infer<typeof AppConfigSchema>;
export type HomeDataZod = z.infer<typeof HomeDataSchema>;
export type AppConfigZod = z.infer<typeof AppConfigSchema>;
