import { createServerSupabaseClient } from '@/lib/supabase';
import { Cattle, CattleWithDetails, GenealogyNode } from '@/lib/types';
import { createCattleSchema, updateCattleSchema, statusChangeSchema, CreateCattleRequest, UpdateCattleRequest, StatusChangeRequest } from '@/lib/validators';
import { AuditService } from '@/lib/auditService';
import { GenealogyService } from '@/lib/genealogyService';

// ============================================
// SERVICIO DE ANIMALES — FASE 4
// ============================================

export class CattleService {

  // ============================================
  // OPERACIONES CRUD BÁSICAS
  // ============================================

  /**
   * Obtiene todos los animales con detalles completos
   */
  static async getCattle(): Promise<CattleWithDetails[]> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('cattle')
      .select(`
        *,
        shed:sheds(*),
        dam:cattle!dam_id(id, code, name, sex),
        sire:cattle!sire_id(id, code, name, sex)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calcular edad y conteo de crías para cada animal
    const cattleWithDetails = await Promise.all(
      (data || []).map(async (cattle) => {
        const age = this.calculateAge(cattle.birth_date);
        const offspringCount = await this.getOffspringCount(cattle.id);

        return {
          ...cattle,
          age_years: age.years,
          age_months: age.months,
          offspring_count: offspringCount,
        } as CattleWithDetails;
      })
    );

    return cattleWithDetails;
  }

  /**
   * Obtiene un animal específico con todos sus detalles
   */
  static async getCattleById(id: string): Promise<CattleWithDetails | null> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('cattle')
      .select(`
        *,
        shed:sheds(*),
        dam:cattle!dam_id(id, code, name, sex, birth_date),
        sire:cattle!sire_id(id, code, name, sex, birth_date)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No encontrado
      throw error;
    }

    const age = this.calculateAge(data.birth_date);
    const offspringCount = await this.getOffspringCount(data.id);

    return {
      ...data,
      age_years: age.years,
      age_months: age.months,
      offspring_count: offspringCount,
    } as CattleWithDetails;
  }

  /**
   * Crea un nuevo animal con validaciones críticas
   */
  static async createCattle(data: CreateCattleRequest, userId: string): Promise<Cattle> {
    const supabase = createServerSupabaseClient();
    // Validar schema
    const validatedData = createCattleSchema.parse(data);

    // RN-01: Código único
    const { data: existing } = await supabase
      .from('cattle')
      .select('id')
      .eq('code', validatedData.code)
      .single();

    if (existing) {
      throw new Error('Ya existe un animal con este código');
    }

    // RN-04: Fecha de nacimiento no anterior a la de la madre
    if (validatedData.dam_id) {
      await this.validateBirthDateAgainstMother(validatedData.birth_date, validatedData.dam_id);
    }

    // RN-09: Validar ciclos genealógicos
    if (validatedData.dam_id) {
      await GenealogyService.validateNoCycles(validatedData.dam_id, null);
    }
    if (validatedData.sire_id) {
      await GenealogyService.validateNoCycles(validatedData.sire_id, null);
    }

    // RN-05: Validar capacidad de bodega
    if (validatedData.shed_id) {
      await this.validateShedCapacity(validatedData.shed_id);
    }

    // Crear animal
    const { data: cattle, error } = await supabase
      .from('cattle')
      .insert({
        ...validatedData,
        created_by: userId,
        updated_by: userId,
      })
      .select()
      .single();

    if (error) throw error;

    // RN-08: Registrar en auditoría
    await AuditService.auditCattleChange(cattle.id, 'create', {}, userId);

    return cattle;
  }

  /**
   * Actualiza un animal con validaciones críticas
   */
  static async updateCattle(id: string, data: UpdateCattleRequest, userId: string): Promise<Cattle> {
    const supabase = createServerSupabaseClient();
    // Validar schema
    const validatedData = updateCattleSchema.parse(data);

    // Obtener animal actual
    const currentCattle = await this.getCattleById(id);
    if (!currentCattle) {
      throw new Error('Animal no encontrado');
    }

    // RN-03: Solo animales activos pueden modificarse
    if (currentCattle.status !== 'activo') {
      throw new Error('No se puede modificar un animal dado de baja');
    }

    // RN-01: Código único (si se está cambiando)
    if (validatedData.code && validatedData.code !== currentCattle.code) {
      const { data: existing } = await supabase
        .from('cattle')
        .select('id')
        .eq('code', validatedData.code)
        .neq('id', id)
        .single();

      if (existing) {
        throw new Error('Ya existe un animal con este código');
      }
    }

    // RN-04: Fecha de nacimiento no anterior a la de la madre
    const birthDate = validatedData.birth_date || currentCattle.birth_date;
    const damId = validatedData.dam_id !== undefined ? validatedData.dam_id : currentCattle.dam_id;
    if (damId && birthDate) {
      await this.validateBirthDateAgainstMother(birthDate, damId);
    }

    // RN-09: Validar ciclos genealógicos
    if (validatedData.dam_id && validatedData.dam_id !== currentCattle.dam_id) {
      await GenealogyService.validateNoCycles(validatedData.dam_id, id);
    }
    if (validatedData.sire_id && validatedData.sire_id !== currentCattle.sire_id) {
      await GenealogyService.validateNoCycles(validatedData.sire_id, id);
    }

    // RN-05: Validar capacidad de bodega
    if (validatedData.shed_id && validatedData.shed_id !== currentCattle.shed_id) {
      await this.validateShedCapacity(validatedData.shed_id);
    }

    // Actualizar animal
    const { data: cattle, error } = await supabase
      .from('cattle')
      .update({
        ...validatedData,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // RN-08: Registrar en auditoría
    const changes = this.calculateChanges(currentCattle, cattle);
    if (Object.keys(changes).length > 0) {
      await AuditService.auditCattleChange(id, 'update', changes, userId);
    }

    return cattle;
  }

  /**
   * Cambia el estado de un animal
   */
  static async changeCattleStatus(id: string, data: StatusChangeRequest, userId: string): Promise<Cattle> {
    const supabase = createServerSupabaseClient();
    // Validar schema
    const validatedData = statusChangeSchema.parse(data);

    // Obtener animal actual
    const currentCattle = await this.getCattleById(id);
    if (!currentCattle) {
      throw new Error('Animal no encontrado');
    }

    // Actualizar estado
    const { data: cattle, error } = await supabase
      .from('cattle')
      .update({
        status: validatedData.status,
        status_reason: validatedData.status_reason,
        status_date: validatedData.status_date || new Date().toISOString().split('T')[0],
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // RN-08: Registrar en auditoría
    const changes = this.calculateChanges(currentCattle, cattle);
    await AuditService.auditCattleChange(id, 'status_change', changes, userId);

    return cattle;
  }

  /**
   * Elimina un animal (soft delete si tiene dependencias)
   */
  static async deleteCattle(id: string, userId: string): Promise<void> {
    const supabase = createServerSupabaseClient();
    // Verificar si tiene dependencias
    const hasDependencies = await this.hasDependencies(id);

    if (hasDependencies) {
      // Soft delete: marcar como inactivo
      await this.changeCattleStatus(id, { status: 'baja', status_reason: 'Eliminado por tener dependencias' }, userId);
    } else {
      // Hard delete
      const { error } = await supabase
        .from('cattle')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // RN-08: Registrar en auditoría
      await AuditService.auditCattleChange(id, 'delete', {}, userId);
    }
  }

  // ============================================
  // FUNCIONES DE VALIDACIÓN CRÍTICA
  // ============================================

  /**
   * RN-04: Valida que la fecha de nacimiento no sea anterior a la de la madre
   */
  private static async validateBirthDateAgainstMother(birthDate: string, damId: string): Promise<void> {
    const supabase = createServerSupabaseClient();
    const { data: dam, error } = await supabase
      .from('cattle')
      .select('birth_date')
      .eq('id', damId)
      .single();

    if (error) throw error;
    if (!dam) throw new Error('Madre no encontrada');

    if (new Date(birthDate) <= new Date(dam.birth_date)) {
      throw new Error('La fecha de nacimiento no puede ser anterior o igual a la fecha de nacimiento de la madre');
    }
  }

  /**
   * RN-09: Valida que no se creen ciclos genealógicos
   */
  private static async validateGenealogicalCycle(parentId: string, excludeId: string | null = null): Promise<void> {
    const supabase = createServerSupabaseClient();
    const visited = new Set<string>();
    const stack: string[] = [parentId];

    while (stack.length > 0) {
      const currentId = stack.pop()!;

      if (visited.has(currentId)) continue;
      visited.add(currentId);

      // Si encontramos el ID excluido, hay un ciclo
      if (excludeId && currentId === excludeId) {
        throw new Error('No se puede asignar este animal como padre/madre porque crearía un ciclo genealógico');
      }

      // Obtener descendientes
      const { data: offspring, error } = await supabase
        .from('cattle')
        .select('id')
        .or(`dam_id.eq.${currentId},sire_id.eq.${currentId}`);

      if (error) throw error;

      for (const child of offspring || []) {
        if (!visited.has(child.id)) {
          stack.push(child.id);
        }
      }
    }
  }

  /**
   * RN-05: Valida que la bodega no exceda su capacidad
   */
  private static async validateShedCapacity(shedId: string): Promise<void> {
    const supabase = createServerSupabaseClient();
    // Obtener capacidad de la bodega
    const { data: shed, error: shedError } = await supabase
      .from('sheds')
      .select('max_capacity')
      .eq('id', shedId)
      .single();

    if (shedError) throw shedError;
    if (!shed) throw new Error('Bodega no encontrada');

    // Contar animales activos en la bodega
    const { count, error: countError } = await supabase
      .from('cattle')
      .select('*', { count: 'exact', head: true })
      .eq('shed_id', shedId)
      .eq('status', 'activo');

    if (countError) throw countError;

    if ((count || 0) >= shed.max_capacity) {
      throw new Error(`La bodega ha alcanzado su capacidad máxima de ${shed.max_capacity} animales`);
    }
  }

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================

  /**
   * Calcula la edad en años y meses
   */
  private static calculateAge(birthDate: string): { years: number; months: number } {
    const birth = new Date(birthDate);
    const now = new Date();

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months };
  }

  /**
   * Obtiene el conteo de crías de un animal
   */
  private static async getOffspringCount(cattleId: string): Promise<number> {
    const supabase = createServerSupabaseClient();
    const { count, error } = await supabase
      .from('cattle')
      .select('*', { count: 'exact', head: true })
      .or(`dam_id.eq.${cattleId},sire_id.eq.${cattleId}`);

    if (error) throw error;
    return count || 0;
  }

  /**
   * Verifica si un animal tiene dependencias que impiden eliminación
   */
  private static async hasDependencies(cattleId: string): Promise<boolean> {
    const supabase = createServerSupabaseClient();
    // Verificar si es padre/madre de otros animales
    const { count: offspringCount, error: offspringError } = await supabase
      .from('cattle')
      .select('*', { count: 'exact', head: true })
      .or(`dam_id.eq.${cattleId},sire_id.eq.${cattleId}`);

    if (offspringError) throw offspringError;

    // Verificar si tiene registros de producción
    const { count: productionCount, error: productionError } = await supabase
      .from('milk_production')
      .select('*', { count: 'exact', head: true })
      .eq('cattle_id', cattleId);

    if (productionError) throw productionError;

    // Verificar si tiene vacunaciones
    const { count: vaccinationCount, error: vaccinationError } = await supabase
      .from('vaccinations')
      .select('*', { count: 'exact', head: true })
      .eq('cattle_id', cattleId);

    if (vaccinationError) throw vaccinationError;

    // Verificar si tiene eventos reproductivos
    const { count: reproductiveCount, error: reproductiveError } = await supabase
      .from('reproductive_events')
      .select('*', { count: 'exact', head: true })
      .eq('cattle_id', cattleId);

    if (reproductiveError) throw reproductiveError;

    return (offspringCount || 0) > 0 ||
           (productionCount || 0) > 0 ||
           (vaccinationCount || 0) > 0 ||
           (reproductiveCount || 0) > 0;
  }

  /**
   * Calcula los cambios entre dos versiones de un animal
   */
  private static calculateChanges(oldCattle: any, newCattle: any): Record<string, { from: any; to: any }> {
    const changes: Record<string, { from: any; to: any }> = {};

    const fields = [
      'code', 'name', 'sex', 'birth_date', 'breed', 'color', 'weight_kg',
      'shed_id', 'status', 'status_reason', 'status_date', 'dam_id', 'sire_id',
      'estimated_value', 'photo_path', 'notes'
    ];

    for (const field of fields) {
      if (oldCattle[field] !== newCattle[field]) {
        changes[field] = { from: oldCattle[field], to: newCattle[field] };
      }
    }

    return changes;
  }

  // ============================================
  // FUNCIONES DE GENEALOGÍA
  // ============================================

  /**
   * Obtiene el árbol genealógico completo de un animal
   */
  static async getGenealogyTree(cattleId: string): Promise<GenealogyNode | null> {
    return await GenealogyService.buildGenealogyTree(cattleId);
  }

  /**
   * Construye un nodo genealógico recursivamente
   */
  private static async buildGenealogyNode(cattleId: string, depth: number): Promise<GenealogyNode | null> {
    const cattle = await this.getCattleById(cattleId);
    if (!cattle) return null;

    const node: GenealogyNode = {
      cattle,
      parents: [],
      offspring: [],
    };

    // Solo agregar padres si depth > 0
    if (depth > 0) {
      if (cattle.dam_id) {
        const damNode = await this.buildGenealogyNode(cattle.dam_id, depth - 1);
        if (damNode) node.parents.push(damNode);
      }

      if (cattle.sire_id) {
        const sireNode = await this.buildGenealogyNode(cattle.sire_id, depth - 1);
        if (sireNode) node.parents.push(sireNode);
      }
    }

    return node;
  }

  // ============================================
  // FUNCIONES DE AUDITORÍA
  // ============================================

  /**
   * Obtiene el historial de auditoría de un animal
   */
  static async getCattleAudit(cattleId: string) {
    return await AuditService.getCattleAudit(cattleId);
  }
}