import { createServerSupabaseClient } from '@/lib/supabase';
import {
  ReproductiveEvent,
  ReproductiveStatusItem,
  CreateReproductiveEventRequest,
} from '@/lib/types';
import { createReproductiveEventSchema } from '@/lib/validators';

const MONTHS_OF_GESTATION = 283;

export class ReproductionService {
  static async getReproductiveStatus(stateFilter?: string): Promise<ReproductiveStatusItem[]> {
    const supabase = createServerSupabaseClient();

    const { data: cattleData, error: cattleError } = await supabase
      .from('cattle')
      .select('id, code, name, sex, status')
      .eq('sex', 'hembra')
      .eq('status', 'activo')
      .order('code', { ascending: true });

    if (cattleError) {
      throw new Error(`Error obteniendo hembras activas: ${cattleError.message}`);
    }

    const cattleIds = (cattleData || []).map((item: any) => item.id);
    const { data: eventsData, error: eventsError } = await supabase
      .from('reproductive_events')
      .select('id, cattle_id, event_type, event_date, expected_birth, notes, created_at')
      .in('cattle_id', cattleIds)
      .order('event_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (eventsError) {
      throw new Error(`Error obteniendo eventos reproductivos: ${eventsError.message}`);
    }

    const lastEventByCattle = new Map<string, ReproductiveEvent>();

    (eventsData || []).forEach((event: any) => {
      if (!lastEventByCattle.has(event.cattle_id)) {
        lastEventByCattle.set(event.cattle_id, event as ReproductiveEvent);
      }
    });

    const result: ReproductiveStatusItem[] = (cattleData || []).map((cattle: any) => {
      const lastEvent = lastEventByCattle.get(cattle.id);
      const currentState = (lastEvent?.event_type as ReproductiveEvent['event_type']) || 'vacía';

      return {
        cattle_id: cattle.id,
        cattle_code: cattle.code,
        cattle_name: cattle.name,
        current_state: currentState,
        last_event_type: lastEvent?.event_type,
        last_event_date: lastEvent?.event_date,
        expected_birth: lastEvent?.expected_birth || null,
        last_notes: lastEvent?.notes,
      };
    });

    if (stateFilter && stateFilter !== 'all') {
      return result.filter(item => item.current_state === stateFilter);
    }

    return result;
  }

  static async getReproductiveTimeline(cattleId: string): Promise<ReproductiveEvent[]> {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('reproductive_events')
      .select('*')
      .eq('cattle_id', cattleId)
      .order('event_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error obteniendo el historial reproductivo: ${error.message}`);
    }

    return data || [];
  }

  static async registerReproductiveEvent(
    requestBody: CreateReproductiveEventRequest,
    userId: string
  ): Promise<ReproductiveEvent> {
    const validatedData = createReproductiveEventSchema.parse(requestBody);
    const supabase = createServerSupabaseClient();

    const { data: cattle, error: cattleError } = await supabase
      .from('cattle')
      .select('id, sex, status')
      .eq('id', validatedData.cattle_id)
      .single();

    if (cattleError || !cattle) {
      throw new Error('Animal no encontrado');
    }

    if (cattle.sex !== 'hembra') {
      throw new Error('Solo hembras activas pueden registrar eventos reproductivos');
    }

    if (cattle.status !== 'activo') {
      throw new Error('Solo hembras activas pueden registrar eventos reproductivos');
    }

    let expectedBirth: string | null = null;

    if (validatedData.event_type === 'preñez') {
      const baseDate = new Date(validatedData.event_date);
      const defaultExpected = new Date(baseDate);
      defaultExpected.setDate(defaultExpected.getDate() + MONTHS_OF_GESTATION);
      expectedBirth = validatedData.expected_birth || defaultExpected.toISOString().split('T')[0];
    }

    const { data, error } = await supabase
      .from('reproductive_events')
      .insert({
        cattle_id: validatedData.cattle_id,
        event_type: validatedData.event_type,
        event_date: validatedData.event_date,
        expected_birth: expectedBirth,
        notes: validatedData.notes,
        registered_by: userId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error registrando evento reproductivo: ${error.message}`);
    }

    return data as ReproductiveEvent;
  }

  static async getReproductiveAlertCount(): Promise<number> {
    const list = await this.getReproductiveStatus();
    return list.filter(item => item.current_state !== 'vacía').length;
  }
}
