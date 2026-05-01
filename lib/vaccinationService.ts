import { createServerSupabaseClient } from './supabase';
import { recordAudit } from './auditService';
import {
  VaccineType,
  Vaccination,
  VaccinationWithCattle,
  VaccinationAlert,
  MassVaccinationRequest,
  MassVaccinationResult,
  CattleSex
} from './types';

// ============================================
// SERVICIO DE VACUNACIÓN — FASE 6
// ============================================

/**
 * Obtiene todos los tipos de vacuna activos
 */
export async function getVaccineTypes(): Promise<VaccineType[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('vaccine_types')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    throw new Error(`Error obteniendo tipos de vacuna: ${error.message}`);
  }

  return data || [];
}

/**
 * Obtiene las vacunaciones de un animal con detalles
 */
export async function getVaccinations(cattleId: string): Promise<VaccinationWithCattle[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('vaccinations')
    .select(`
      *,
      cattle:cattle_id(id, code, name, sex),
      vaccine_type:vaccine_type_id(*)
    `)
    .eq('cattle_id', cattleId)
    .order('applied_date', { ascending: false });

  if (error) {
    throw new Error(`Error obteniendo vacunaciones: ${error.message}`);
  }

  return data || [];
}

/**
 * Registra una vacunación individual
 */
export async function registerVaccination(
  vaccinationData: {
    cattle_id: string;
    vaccine_type_id: string;
    applied_date: string;
    dose?: string;
    notes?: string;
  },
  userId: string
): Promise<Vaccination> {
  const supabase = createServerSupabaseClient();

  // Validar que el animal existe y está activo
  const { data: cattle, error: cattleError } = await supabase
    .from('cattle')
    .select('id, sex, status')
    .eq('id', vaccinationData.cattle_id)
    .single();

  if (cattleError || !cattle) {
    throw new Error('Animal no encontrado');
  }

  if (cattle.status !== 'activo') {
    throw new Error('Solo se puede vacunar animales activos');
  }

  // Obtener el tipo de vacuna
  const { data: vaccineType, error: vaccineError } = await supabase
    .from('vaccine_types')
    .select('*')
    .eq('id', vaccinationData.vaccine_type_id)
    .single();

  if (vaccineError || !vaccineType) {
    throw new Error('Tipo de vacuna no encontrado');
  }

  // Validar restricción de sexo (RN-14)
  if (vaccineType.allowed_sex && cattle.sex !== vaccineType.allowed_sex) {
    throw new Error(`Esta vacuna solo puede aplicarse a ${vaccineType.allowed_sex === 'hembra' ? 'hembras' : 'machos'}`);
  }

  // Calcular next_dose_date
  const appliedDate = new Date(vaccinationData.applied_date);
  const nextDoseDate = new Date(appliedDate);
  nextDoseDate.setDate(appliedDate.getDate() + vaccineType.periodicity_days);

  // Insertar vacunación
  const { data, error } = await supabase
    .from('vaccinations')
    .insert({
      cattle_id: vaccinationData.cattle_id,
      vaccine_type_id: vaccinationData.vaccine_type_id,
      vaccine_name: vaccineType.name,
      applied_date: vaccinationData.applied_date,
      dose: vaccinationData.dose,
      next_dose_date: nextDoseDate.toISOString().split('T')[0],
      applied_by: userId,
      notes: vaccinationData.notes,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error registrando vacunación: ${error.message}`);
  }

  // Registrar auditoría
  await recordAudit({
    table_name: 'vaccinations',
    record_id: data.id,
    action: 'create',
    old_values: null,
    new_values: data,
    user_id: userId,
  });

  return data;
}

/**
 * Registra vacunaciones masivas de manera atómica
 */
export async function registerMassVaccination(
  request: MassVaccinationRequest,
  userId: string
): Promise<MassVaccinationResult> {
  const supabase = createServerSupabaseClient();

  const result: MassVaccinationResult = {
    success: true,
    total_requested: request.cattle_ids.length,
    total_applied: 0,
    skipped: [],
    applied: [],
  };

  // Obtener el tipo de vacuna
  const { data: vaccineType, error: vaccineError } = await supabase
    .from('vaccine_types')
    .select('*')
    .eq('id', request.vaccine_type_id)
    .single();

  if (vaccineError || !vaccineType) {
    throw new Error('Tipo de vacuna no encontrado');
  }

  // Obtener todos los animales solicitados
  const { data: cattleList, error: cattleError } = await supabase
    .from('cattle')
    .select('id, code, name, sex, status')
    .in('id', request.cattle_ids);

  if (cattleError) {
    throw new Error(`Error obteniendo animales: ${cattleError.message}`);
  }

  // Filtrar animales válidos
  const validCattle = cattleList?.filter(cattle => {
    if (cattle.status !== 'activo') {
      result.skipped.push({
        cattle_id: cattle.id,
        cattle_code: cattle.code,
        reason: 'Animal no está activo',
      });
      return false;
    }

    if (vaccineType.allowed_sex && cattle.sex !== vaccineType.allowed_sex) {
      result.skipped.push({
        cattle_id: cattle.id,
        cattle_code: cattle.code,
        reason: `Vacuna solo para ${vaccineType.allowed_sex === 'hembra' ? 'hembras' : 'machos'}`,
      });
      return false;
    }

    return true;
  }) || [];

  if (validCattle.length === 0) {
    return result;
  }

  // Preparar datos para inserción masiva
  const appliedDate = new Date(request.applied_date);
  const nextDoseDate = new Date(appliedDate);
  nextDoseDate.setDate(appliedDate.getDate() + vaccineType.periodicity_days);

  const vaccinationsToInsert = validCattle.map(cattle => ({
    cattle_id: cattle.id,
    vaccine_type_id: request.vaccine_type_id,
    vaccine_name: vaccineType.name,
    applied_date: request.applied_date,
    dose: request.dose,
    next_dose_date: nextDoseDate.toISOString().split('T')[0],
    applied_by: userId,
    notes: request.notes,
  }));

  // Insertar todas las vacunaciones en una transacción
  const { data: insertedVaccinations, error: insertError } = await supabase
    .from('vaccinations')
    .insert(vaccinationsToInsert)
    .select('id, cattle_id');

  if (insertError) {
    throw new Error(`Error en vacunación masiva: ${insertError.message}`);
  }

  // Actualizar resultado
  result.total_applied = insertedVaccinations?.length || 0;
  result.applied = insertedVaccinations?.map(v => ({
    cattle_id: v.cattle_id,
    vaccination_id: v.id,
  })) || [];

  // Registrar auditoría para cada vacunación
  for (const vaccination of insertedVaccinations || []) {
    await recordAudit({
      table_name: 'vaccinations',
      record_id: vaccination.id,
      action: 'create',
      old_values: null,
      new_values: { ...vaccinationsToInsert.find(v => v.cattle_id === vaccination.cattle_id) },
      user_id: userId,
    });
  }

  return result;
}

/**
 * Obtiene alertas de vacunaciones próximas (dentro de 7 días)
 */
export async function getVaccinationAlerts(): Promise<VaccinationAlert[]> {
  const supabase = createServerSupabaseClient();

  // Calcular fecha límite (hoy + 7 días)
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() + 7);
  const limitDateStr = limitDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('vaccinations')
    .select(`
      cattle_id,
      next_dose_date,
      vaccine_type_id
    `)
    .lte('next_dose_date', limitDateStr)
    .not('next_dose_date', 'is', null); // No nulos

  if (error) {
    throw new Error(`Error obteniendo alertas: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Obtener información de los animales y tipos de vacuna
  const cattleIds = [...new Set(data.map(item => item.cattle_id))];
  const vaccineTypeIds = [...new Set(data.map(item => item.vaccine_type_id))];

  const [cattleData, vaccineTypeData] = await Promise.all([
    supabase.from('cattle').select('id, code, name, status').in('id', cattleIds),
    supabase.from('vaccine_types').select('id, name').in('id', vaccineTypeIds)
  ]);

  if (cattleData.error) throw new Error(`Error obteniendo datos de cattle: ${cattleData.error.message}`);
  if (vaccineTypeData.error) throw new Error(`Error obteniendo datos de vaccine_types: ${vaccineTypeData.error.message}`);

  const cattleMap = new Map(cattleData.data?.map(c => [c.id, c]) || []);
  const vaccineTypeMap = new Map(vaccineTypeData.data?.map(v => [v.id, v]) || []);

  // Calcular días hasta vencimiento
  const today = new Date();
  const alerts: VaccinationAlert[] = data
    .filter(item => {
      const cattle = cattleMap.get(item.cattle_id);
      return cattle && cattle.status === 'activo';
    })
    .map(item => {
      const nextDose = new Date(item.next_dose_date);
      const daysUntilDue = Math.ceil((nextDose.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      const cattle = cattleMap.get(item.cattle_id)!;
      const vaccineType = vaccineTypeMap.get(item.vaccine_type_id)!;

      return {
        cattle_id: item.cattle_id,
        cattle_code: cattle.code,
        cattle_name: cattle.name,
        vaccine_type_name: vaccineType.name,
        next_dose_date: item.next_dose_date,
        days_until_due: daysUntilDue,
      };
    });

  return alerts;
}

/**
 * Sube certificado de vacunación a Storage
 */
export async function uploadVaccinationCertificate(
  vaccinationId: string,
  certificateFile: File,
  userId: string
): Promise<string> {
  const supabase = createServerSupabaseClient();

  // Validar que la vacunación existe
  const { data: vaccination, error: vaccError } = await supabase
    .from('vaccinations')
    .select('id, cattle_id')
    .eq('id', vaccinationId)
    .single();

  if (vaccError || !vaccination) {
    throw new Error('Vacunación no encontrada');
  }

  // Generar path único
  const fileName = `certificate_${Date.now()}.pdf`;
  const filePath = `vaccinations/${vaccinationId}/${fileName}`;

  // Subir archivo a Storage
  const { error: uploadError } = await supabase.storage
    .from('sig-bovino-media')
    .upload(filePath, certificateFile, {
      contentType: 'application/pdf',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Error subiendo certificado: ${uploadError.message}`);
  }

  // Actualizar vacunación con el path
  const { error: updateError } = await supabase
    .from('vaccinations')
    .update({ certificate_path: filePath })
    .eq('id', vaccinationId);

  if (updateError) {
    // Intentar eliminar el archivo subido si falla la actualización
    await supabase.storage
      .from('sig-bovino-media')
      .remove([filePath]);

    throw new Error(`Error actualizando vacunación: ${updateError.message}`);
  }

  // Registrar auditoría
  await recordAudit({
    table_name: 'vaccinations',
    record_id: vaccinationId,
    action: 'update',
    old_values: { certificate_path: null },
    new_values: { certificate_path: filePath },
    user_id: userId,
  });

  return filePath;
}