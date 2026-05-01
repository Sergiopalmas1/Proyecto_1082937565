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
    author: z.string().optional(),
  }),
});

// Schema de validación para AppConfig
export const AppConfigSchema = z.object({
  appName: z.string().min(1, 'App name is required'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semantic'),
  locale: z.string().min(2, 'Locale is required'),
  theme: z.enum(['light', 'dark']),
  author: z.object({
    name: z.string().min(1, 'Author name is required'),
    document: z.string().min(1, 'Document number is required'),
  }).optional(),
});

// Tipos inferidos de Zod (opcional pero recomendado)
export type HomeDataValidated = z.infer<typeof HomeDataSchema>;
export type AppConfigValidated = z.infer<typeof AppConfigSchema>;

// ============================================
// SCHEMAS DE AUTENTICACIÓN — FASE 1
// ============================================

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña requerida'),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export const changePasswordSchema = z.object({
  current_password: z.string().min(6, 'Contraseña actual requerida'),
  new_password: z.string().min(8, 'Nueva contraseña debe tener al menos 8 caracteres'),
});

export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;

export const createUserSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100, 'Nombre demasiado largo'),
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'veterinario', 'operario']),
  is_active: z.boolean().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100, 'Nombre demasiado largo').optional(),
  email: z.string().email('Email inválido').optional(),
  role: z.enum(['admin', 'veterinario', 'operario']).optional(),
  is_active: z.boolean().optional(),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;

// ============================================
// SCHEMAS DE BODEGAS — FASE 3
// ============================================

export const createShedSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100, 'Nombre demasiado largo'),
  type: z.enum(['pastizal', 'establo', 'corral', 'enfermería', 'parto', 'otro']),
  surface_m2: z.number().positive('Superficie debe ser positiva').optional(),
  max_capacity: z.number().int().positive('Capacidad máxima debe ser positiva'),
});

export const updateShedSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100, 'Nombre demasiado largo').optional(),
  type: z.enum(['pastizal', 'establo', 'corral', 'enfermería', 'parto', 'otro']).optional(),
  surface_m2: z.number().positive('Superficie debe ser positiva').optional(),
  max_capacity: z.number().int().positive('Capacidad máxima debe ser positiva').optional(),
});

export type CreateShedRequest = z.infer<typeof createShedSchema>;
export type UpdateShedRequest = z.infer<typeof updateShedSchema>;

// ============================================
// SCHEMAS DE ANIMALES — FASE 4
// ============================================

export const createCattleSchema = z.object({
  code: z.string().min(1, 'Código requerido').max(30, 'Código demasiado largo'),
  name: z.string().max(100, 'Nombre demasiado largo').optional(),
  sex: z.enum(['macho', 'hembra']),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha de nacimiento inválida'),
  breed: z.string().max(80, 'Raza demasiado larga').optional(),
  color: z.string().max(80, 'Color demasiado largo').optional(),
  weight_kg: z.number().positive('Peso debe ser positivo').optional(),
  shed_id: z.string().uuid('ID de bodega inválido').optional(),
  dam_id: z.string().uuid('ID de madre inválido').optional(),
  sire_id: z.string().uuid('ID de padre inválido').optional(),
  estimated_value: z.number().positive('Valor estimado debe ser positivo').optional(),
  notes: z.string().max(1000, 'Notas demasiado largas').optional(),
});

export const updateCattleSchema = z.object({
  code: z.string().min(1, 'Código requerido').max(30, 'Código demasiado largo').optional(),
  name: z.string().max(100, 'Nombre demasiado largo').optional(),
  sex: z.enum(['macho', 'hembra']).optional(),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha de nacimiento inválida').optional(),
  breed: z.string().max(80, 'Raza demasiado larga').optional(),
  color: z.string().max(80, 'Color demasiado largo').optional(),
  weight_kg: z.number().positive('Peso debe ser positivo').optional(),
  shed_id: z.string().uuid('ID de bodega inválido').optional(),
  dam_id: z.string().uuid('ID de madre inválido').optional(),
  sire_id: z.string().uuid('ID de padre inválido').optional(),
  estimated_value: z.number().positive('Valor estimado debe ser positivo').optional(),
  notes: z.string().max(1000, 'Notas demasiado largas').optional(),
});

export const statusChangeSchema = z.object({
  status: z.enum(['activo', 'baja', 'vendido', 'muerto']),
  status_reason: z.string().max(500, 'Razón demasiado larga').optional(),
  status_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha de estado inválida').optional(),
});

export type CreateCattleRequest = z.infer<typeof createCattleSchema>;
export type UpdateCattleRequest = z.infer<typeof updateCattleSchema>;
export type StatusChangeRequest = z.infer<typeof statusChangeSchema>;

// ============================================
// SCHEMAS DE PRODUCCIÓN LÁCTEA — FASE 5
// ============================================

export const createMilkProductionSchema = z.object({
  cattle_id: z.string().uuid('ID de animal inválido'),
  production_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha de producción inválida'),
  shift: z.enum(['mañana', 'tarde'], { errorMap: () => ({ message: 'Turno debe ser mañana o tarde' }) }),
  liters: z.number().min(0, 'Litros no pueden ser negativos').max(60, 'Litros no pueden superar 60'),
});

export const resolveAlertSchema = z.object({
  alert_id: z.string().uuid('ID de alerta inválido'),
});

export type CreateMilkProductionRequest = z.infer<typeof createMilkProductionSchema>;
export type ResolveAlertRequest = z.infer<typeof resolveAlertSchema>;

// ============================================
// SCHEMAS DE VACUNACIÓN — FASE 6
// ============================================

export const createVaccinationSchema = z.object({
  cattle_id: z.string().uuid('ID de animal inválido'),
  vaccine_type_id: z.string().uuid('ID de tipo de vacuna inválido'),
  applied_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha de aplicación inválida'),
  dose: z.string().max(30, 'Dosis demasiado larga').optional(),
  notes: z.string().max(1000, 'Notas demasiado largas').optional(),
});

export const massVaccinationSchema = z.object({
  cattle_ids: z.array(z.string().uuid('ID de animal inválido')).min(1, 'Debe seleccionar al menos un animal'),
  vaccine_type_id: z.string().uuid('ID de tipo de vacuna inválido'),
  applied_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha de aplicación inválida'),
  dose: z.string().max(30, 'Dosis demasiado larga').optional(),
  notes: z.string().max(1000, 'Notas demasiado largas').optional(),
});

export const uploadCertificateSchema = z.object({
  vaccination_id: z.string().uuid('ID de vacunación inválido'),
  certificate: z.instanceof(File)
    .refine(file => file.type === 'application/pdf', 'Solo se permiten archivos PDF')
    .refine(file => file.size <= 5 * 1024 * 1024, 'Archivo no puede superar 5MB'),
});

export const createReproductiveEventSchema = z.object({
  cattle_id: z.string().uuid('ID de animal inválido'),
  event_type: z.enum(['celo', 'preñez', 'parto', 'lactancia', 'vacía']),
  event_date: z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Fecha de evento inválida'),
  expected_birth: z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Fecha estimada de parto inválida').optional(),
  notes: z.string().max(1000, 'Notas demasiado largas').optional(),
});

export type CreateVaccinationRequest = z.infer<typeof createVaccinationSchema>;
export type MassVaccinationRequest = z.infer<typeof massVaccinationSchema>;
export type UploadCertificateRequest = z.infer<typeof uploadCertificateSchema>;
export type CreateReproductiveEventRequest = z.infer<typeof createReproductiveEventSchema>;
