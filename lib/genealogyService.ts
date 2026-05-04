import { createServerSupabaseClient } from '@/lib/supabase';
import { GenealogyNode, CattleWithDetails } from '@/lib/types';

// ============================================
// SERVICIO DE GENEALOGÍA — FASE 4
// ============================================

export class GenealogyService {

  /**
   * Valida que no se creen ciclos genealógicos (RN-09)
   * Implementación recursiva que verifica si un ancestro propuesto
   * aparece en los descendientes del animal actual
   */
  static async validateNoCycles(parentId: string, excludeId: string | null = null): Promise<void> {
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

      // Obtener descendientes directos
      const { data: offspring, error } = await supabase
        .from('cattle')
        .select('id')
        .or(`dam_id.eq.${currentId},sire_id.eq.${currentId}`);

      if (error) throw error;

      // Agregar descendientes a la pila para continuar la búsqueda
      for (const child of offspring || []) {
        if (!visited.has(child.id)) {
          stack.push(child.id);
        }
      }
    }
  }

  /**
   * Construye el árbol genealógico completo de un animal
   * Retorna 2 niveles arriba (padres y abuelos) y 1 nivel abajo (crías directas)
   */
  static async buildGenealogyTree(cattleId: string): Promise<GenealogyNode | null> {
    const supabase = createServerSupabaseClient();
    // Obtener datos del animal raíz
    const { data: cattle, error } = await supabase
      .from('cattle')
      .select(`
        *,
        shed:sheds(*),
        dam:cattle!dam_id(id, code, name, sex, birth_date),
        sire:cattle!sire_id(id, code, name, sex, birth_date)
      `)
      .eq('id', cattleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No encontrado
      throw error;
    }

    // Calcular edad y datos adicionales
    const age = this.calculateAge(cattle.birth_date);
    const offspringCount = await this.getOffspringCount(cattle.id);

    const rootCattle: CattleWithDetails = {
      ...cattle,
      age_years: age.years,
      age_months: age.months,
      offspring_count: offspringCount,
    };

    const node: GenealogyNode = {
      cattle: rootCattle,
      parents: [],
      offspring: [],
    };

    // Construir padres (2 niveles arriba)
    if (cattle.dam_id) {
      const damNode = await this.buildAncestorNode(cattle.dam_id, 1);
      if (damNode) node.parents.push(damNode);
    }

    if (cattle.sire_id) {
      const sireNode = await this.buildAncestorNode(cattle.sire_id, 1);
      if (sireNode) node.parents.push(sireNode);
    }

    // Construir crías (1 nivel abajo)
    const { data: offspring, error: offspringError } = await supabase
      .from('cattle')
      .select('id')
      .or(`dam_id.eq.${cattleId},sire_id.eq.${cattleId}`)
      .order('birth_date', { ascending: false });

    if (offspringError) throw offspringError;

    for (const child of offspring || []) {
      const childNode = await this.buildDescendantNode(child.id, 0);
      if (childNode) node.offspring.push(childNode);
    }

    return node;
  }

  /**
   * Construye un nodo ancestro recursivamente (para padres/abuelos)
   */
  private static async buildAncestorNode(cattleId: string, depth: number): Promise<GenealogyNode | null> {
    const supabase = createServerSupabaseClient();
    // Obtener datos del ancestro
    const { data: cattle, error } = await supabase
      .from('cattle')
      .select(`
        *,
        shed:sheds(*),
        dam:cattle!dam_id(id, code, name, sex, birth_date),
        sire:cattle!sire_id(id, code, name, sex, birth_date)
      `)
      .eq('id', cattleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No encontrado
      throw error;
    }

    const age = this.calculateAge(cattle.birth_date);
    const offspringCount = await this.getOffspringCount(cattle.id);

    const ancestorCattle: CattleWithDetails = {
      ...cattle,
      age_years: age.years,
      age_months: age.months,
      offspring_count: offspringCount,
    };

    const node: GenealogyNode = {
      cattle: ancestorCattle,
      parents: [],
      offspring: [],
    };

    // Solo agregar ancestros si depth > 0
    if (depth > 0) {
      if (cattle.dam_id) {
        const damNode = await this.buildAncestorNode(cattle.dam_id, depth - 1);
        if (damNode) node.parents.push(damNode);
      }

      if (cattle.sire_id) {
        const sireNode = await this.buildAncestorNode(cattle.sire_id, depth - 1);
        if (sireNode) node.parents.push(sireNode);
      }
    }

    return node;
  }

  /**
   * Construye un nodo descendiente (para crías)
   */
  private static async buildDescendantNode(cattleId: string, depth: number): Promise<GenealogyNode | null> {
    const supabase = createServerSupabaseClient();
    // Obtener datos del descendiente
    const { data: cattle, error } = await supabase
      .from('cattle')
      .select(`
        *,
        shed:sheds(*),
        dam:cattle!dam_id(id, code, name, sex, birth_date),
        sire:cattle!sire_id(id, code, name, sex, birth_date)
      `)
      .eq('id', cattleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No encontrado
      throw error;
    }

    const age = this.calculateAge(cattle.birth_date);
    const offspringCount = await this.getOffspringCount(cattle.id);

    const descendantCattle: CattleWithDetails = {
      ...cattle,
      age_years: age.years,
      age_months: age.months,
      offspring_count: offspringCount,
    };

    const node: GenealogyNode = {
      cattle: descendantCattle,
      parents: [], // No mostrar padres de las crías para mantener simple
      offspring: [], // No mostrar crías de las crías
    };

    return node;
  }

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
   * Obtiene la línea ancestral completa de un animal (para validaciones)
   */
  static async getAncestors(cattleId: string): Promise<string[]> {
    const supabase = createServerSupabaseClient();
    const ancestors: string[] = [];
    const visited = new Set<string>();
    const stack: string[] = [cattleId];

    while (stack.length > 0) {
      const currentId = stack.pop()!;

      if (visited.has(currentId)) continue;
      visited.add(currentId);

      // Obtener padres
      const { data: parents, error } = await supabase
        .from('cattle')
        .select('dam_id, sire_id')
        .eq('id', currentId)
        .single();

      if (error) throw error;

      if (parents?.dam_id && !visited.has(parents.dam_id)) {
        ancestors.push(parents.dam_id);
        stack.push(parents.dam_id);
      }

      if (parents?.sire_id && !visited.has(parents.sire_id)) {
        ancestors.push(parents.sire_id);
        stack.push(parents.sire_id);
      }
    }

    return ancestors;
  }

  /**
   * Obtiene todos los descendientes de un animal (para validaciones)
   */
  static async getDescendants(cattleId: string): Promise<string[]> {
    const supabase = createServerSupabaseClient();
    const descendants: string[] = [];
    const visited = new Set<string>();
    const stack: string[] = [cattleId];

    while (stack.length > 0) {
      const currentId = stack.pop()!;

      if (visited.has(currentId)) continue;
      visited.add(currentId);

      // Obtener crías
      const { data: offspring, error } = await supabase
        .from('cattle')
        .select('id')
        .or(`dam_id.eq.${currentId},sire_id.eq.${currentId}`);

      if (error) throw error;

      for (const child of offspring || []) {
        if (!visited.has(child.id)) {
          descendants.push(child.id);
          stack.push(child.id);
        }
      }
    }

    return descendants;
  }
}