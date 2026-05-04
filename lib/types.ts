// Tipos e interfaces globales del proyecto

export interface HomeData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    animationStyle: 'typewriter' | 'fadeIn' | 'slideUp';
  };
  meta: {
    pageTitle: string;
    description: string;
    author?: string;
  };
}

export interface AppConfig {
  appName: string;
  version: string;
  locale: string;
  theme: 'light' | 'dark';
  author?: {
    name: string;
    document: string;
  };
}

// ============================================
// TIPOS DE AUTENTICACIÓN — FASE 1
// ============================================

export type UserRole = 'admin' | 'veterinario' | 'operario';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  must_change_password: boolean;
  last_login_at?: string;
  created_at: string;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  must_change_password?: boolean;
  last_login_at?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: SafeUser;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

// ============================================
// TIPOS DE BODEGAS — FASE 3
// ============================================

export type ShedType = 'pastizal' | 'establo' | 'corral' | 'enfermería' | 'parto' | 'otro';

export interface Shed {
  id: string;
  name: string;
  type: ShedType;
  surface_m2?: number;
  max_capacity: number;
  is_active: boolean;
  created_at: string;
}

export interface ShedWithCount extends Shed {
  current_count: number;
}

// ============================================
// TIPOS DE ANIMALES — FASE 4
// ============================================

export type CattleSex = 'macho' | 'hembra';
export type CattleStatus = 'activo' | 'baja' | 'vendido' | 'muerto';

export interface Cattle {
  id: string;
  code: string;
  name?: string;
  sex: CattleSex;
  birth_date: string;
  breed?: string;
  color?: string;
  weight_kg?: number;
  shed_id?: string;
  status: CattleStatus;
  status_reason?: string;
  status_date?: string;
  dam_id?: string; // madre
  sire_id?: string; // padre
  estimated_value?: number;
  photo_path?: string;
  notes?: string;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CattleWithDetails extends Cattle {
  shed?: Shed;
  dam?: Cattle;
  sire?: Cattle;
  offspring_count?: number;
  age_years?: number;
  age_months?: number;
}

export interface CattleAudit {
  id: string;
  cattle_id: string;
  action: 'create' | 'update' | 'status_change' | 'delete';
  changes: Record<string, { from: any; to: any }>;
  changed_by?: string;
  created_at: string;
}

export interface GenealogyNode {
  cattle: CattleWithDetails;
  parents: GenealogyNode[];
  offspring: GenealogyNode[];
}

// ============================================
// TIPOS DE PRODUCCIÓN LÁCTEA — FASE 5
// ============================================

export interface MilkProduction {
  id: string;
  cattle_id: string;
  production_date: string; // YYYY-MM-DD
  shift: 'mañana' | 'tarde';
  liters: number;
  recorded_by?: string;
  created_at: string;
}

export interface MilkProductionWithCattle extends MilkProduction {
  cattle: {
    id: string;
    code: string;
    name?: string;
  };
}

export interface ProductionAlert {
  id: string;
  cattle_id: string;
  production_id?: string;
  alert_type: 'production_drop';
  current_liters: number;
  average_liters: number;
  drop_percentage: number;
  is_resolved: boolean;
  created_at: string;
}

export interface ProductionAlertWithCattle extends ProductionAlert {
  cattle: {
    id: string;
    code: string;
    name?: string;
  };
}

// ============================================
// TIPOS DE VACUNACIÓN — FASE 6
// ============================================

export interface VaccineType {
  id: string;
  name: string;
  description?: string;
  periodicity_days: number;
  is_mandatory: boolean;
  allowed_sex?: 'macho' | 'hembra';
  is_active: boolean;
  created_at: string;
}

export interface Vaccination {
  id: string;
  cattle_id: string;
  vaccine_type_id: string;
  vaccine_name: string;
  applied_date: string; // YYYY-MM-DD
  dose?: string;
  next_dose_date?: string; // YYYY-MM-DD
  applied_by?: string;
  certificate_path?: string;
  notes?: string;
  created_at: string;
}

export interface VaccinationWithCattle extends Vaccination {
  cattle: {
    id: string;
    code: string;
    name?: string;
    sex: CattleSex;
  };
  vaccine_type: VaccineType;
}

export interface VaccinationAlert {
  cattle_id: string;
  cattle_code: string;
  cattle_name?: string;
  vaccine_type_name: string;
  next_dose_date: string;
  days_until_due: number;
}

export interface MassVaccinationRequest {
  cattle_ids: string[];
  vaccine_type_id: string;
  applied_date: string;
  dose?: string;
  notes?: string;
}

export interface MassVaccinationResult {
  success: boolean;
  total_requested: number;
  total_applied: number;
  skipped: Array<{
    cattle_id: string;
    cattle_code: string;
    reason: string;
  }>;
  applied: Array<{
    cattle_id: string;
    vaccination_id: string;
  }>;
}

export type ReproductiveEventType = 'celo' | 'preñez' | 'parto' | 'lactancia' | 'vacía';

export interface ReproductiveEvent {
  id: string;
  cattle_id: string;
  event_type: ReproductiveEventType;
  event_date: string;
  expected_birth?: string | null;
  notes?: string;
  registered_by?: string;
  created_at: string;
}

export interface ReproductiveStatusItem {
  cattle_id: string;
  cattle_code: string;
  cattle_name?: string;
  current_state: ReproductiveEventType;
  last_event_type?: ReproductiveEventType;
  last_event_date?: string;
  expected_birth?: string | null;
  last_notes?: string;
}

export interface CreateReproductiveEventRequest {
  cattle_id: string;
  event_type: ReproductiveEventType;
  event_date: string;
  expected_birth?: string;
  notes?: string;
}
