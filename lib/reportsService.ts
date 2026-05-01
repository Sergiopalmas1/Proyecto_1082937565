import { createServerSupabaseClient } from '@/lib/supabase';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export interface ProductionComparisonParams {
  period1Start: string;
  period1End: string;
  period2Start: string;
  period2End: string;
}

export interface ProductionData {
  date: string;
  period1_liters: number;
  period2_liters: number;
}

export interface ProductionSummary {
  period1_total: number;
  period1_days: number;
  period1_avg_daily: number;
  period2_total: number;
  period2_days: number;
  period2_avg_daily: number;
  difference_absolute: number;
  difference_percentage: number;
  daily_data: ProductionData[];
}

export interface SanitaryReportData {
  finca_name: string;
  propietario_name: string;
  total_animals: number;
  vaccinated_animals: number;
  vaccinations: Array<{
    cattle_code: string;
    cattle_name: string;
    vaccine_name: string;
    applied_date: string;
    dose: string;
    veterinarian: string;
  }>;
}

export interface FiscalInventoryItem {
  code: string;
  name: string;
  sex: string;
  age_years: number;
  breed: string;
  weight_kg: number;
  estimated_value: number;
  category: string;
}

export interface FiscalInventorySummary {
  total_animals: number;
  total_value: number;
  categories: {
    terneros: { count: number; value: number };
    novillos: { count: number; value: number };
    vacas: { count: number; value: number };
    toros: { count: number; value: number };
  };
  items: FiscalInventoryItem[];
}

export class ReportError extends Error {
  status: number;

  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
    this.name = 'ReportError';
  }
}

export class ReportsService {
  private supabase = createServerSupabaseClient();

  async generateProductionComparison(params: ProductionComparisonParams): Promise<ProductionSummary> {
    const { period1Start, period1End, period2Start, period2End } = params;

    // Validar RN-10: mínimo 7 días por período
    const period1Days = Math.ceil((new Date(period1End).getTime() - new Date(period1Start).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const period2Days = Math.ceil((new Date(period2End).getTime() - new Date(period2Start).getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (period1Days < 7 || period2Days < 7) {
      throw new ReportError('Cada período debe tener al menos 7 días para generar el reporte comparativo', 400);
    }

    // Obtener datos de producción para ambos períodos
    const { data: period1Data, error: error1 } = await this.supabase
      .from('milk_production')
      .select('production_date, liters')
      .gte('production_date', period1Start)
      .lte('production_date', period1End);

    const { data: period2Data, error: error2 } = await this.supabase
      .from('milk_production')
      .select('production_date, liters')
      .gte('production_date', period2Start)
      .lte('production_date', period2End);

    if (error1 || error2) {
      throw new ReportError('Error obteniendo datos de producción', 500);
    }

    if (!period1Data || period1Data.length === 0 || !period2Data || period2Data.length === 0) {
      throw new ReportError('No hay datos de producción en los períodos seleccionados', 404);
    }

    // Calcular totales por período
    const period1Total = period1Data.reduce((sum, p) => sum + p.liters, 0);
    const period2Total = period2Data.reduce((sum, p) => sum + p.liters, 0);

    // Agrupar por día
    const dailyMap1 = new Map<string, number>();
    const dailyMap2 = new Map<string, number>();

    period1Data.forEach(p => {
      const date = p.production_date;
      dailyMap1.set(date, (dailyMap1.get(date) || 0) + p.liters);
    });

    period2Data.forEach(p => {
      const date = p.production_date;
      dailyMap2.set(date, (dailyMap2.get(date) || 0) + p.liters);
    });

    // Crear array de días combinados
    const allDates = new Set([...dailyMap1.keys(), ...dailyMap2.keys()]);
    const dailyData: ProductionData[] = Array.from(allDates).sort().map(date => ({
      date,
      period1_liters: dailyMap1.get(date) || 0,
      period2_liters: dailyMap2.get(date) || 0,
    }));

    const difference = period2Total - period1Total;
    const percentage = period1Total > 0 ? (difference / period1Total) * 100 : 0;

    return {
      period1_total: period1Total,
      period1_days: period1Days,
      period1_avg_daily: period1Total / period1Days,
      period2_total: period2Total,
      period2_days: period2Days,
      period2_avg_daily: period2Total / period2Days,
      difference_absolute: difference,
      difference_percentage: percentage,
      daily_data: dailyData,
    };
  }

  async generateSanitaryReport(startDate: string, endDate: string): Promise<SanitaryReportData> {
    // Obtener datos de vacunaciones en el período
    const { data: vaccinations, error } = await this.supabase
      .from('vaccinations')
      .select(`
        applied_date,
        dose,
        cattle:cattle_id(code, name),
        vaccine_type:vaccine_type_id(name),
        registered_by(name)
      `)
      .gte('applied_date', startDate)
      .lte('applied_date', endDate)
      .eq('cattle.status', 'activo')
      .order('applied_date', { ascending: true });

    if (error) {
      throw new ReportError('Error obteniendo datos de vacunaciones', 500);
    }

    // Obtener total de animales activos
    const { count: totalAnimals, error: countError } = await this.supabase
      .from('cattle')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'activo');

    if (countError) {
      throw new Error('Error obteniendo total de animales');
    }

    // Procesar datos
    const processedVaccinations = (vaccinations || []).map((v: any) => ({
      cattle_code: v.cattle?.code || 'N/A',
      cattle_name: v.cattle?.name || 'Sin nombre',
      vaccine_name: v.vaccine_type?.name || 'N/A',
      applied_date: v.applied_date,
      dose: v.dose || 'N/A',
      veterinarian: v.registered_by?.name || 'N/A',
    }));

    if (!vaccinations || vaccinations.length === 0) {
      throw new ReportError('No hay vacunaciones registradas en el período seleccionado', 404);
    }

    // Contar animales únicos vacunados
    const vaccinatedAnimalCodes = new Set(processedVaccinations.map(v => v.cattle_code));

    return {
      finca_name: 'Finca SIG Bovino', // TODO: obtener de configuración
      propietario_name: 'Administrador SIG Bovino', // TODO: obtener de configuración
      total_animals: totalAnimals || 0,
      vaccinated_animals: vaccinatedAnimalCodes.size,
      vaccinations: processedVaccinations,
    };
  }

  async generateFiscalInventory(): Promise<FiscalInventorySummary> {
    // Obtener todos los animales activos con sus datos
    const { data: cattle, error } = await this.supabase
      .from('cattle')
      .select('code, name, sex, birth_date, breed, weight_kg, estimated_value')
      .eq('status', 'activo')
      .order('code');

    if (error) {
      throw new ReportError('Error obteniendo datos del inventario', 500);
    }

    if (!cattle || cattle.length === 0) {
      throw new ReportError('No hay animales activos en el inventario', 404);
    }

    const items: FiscalInventoryItem[] = cattle.map(c => {
      const birthDate = new Date(c.birth_date);
      const today = new Date();
      const ageYears = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365));

      let category = '';
      if (ageYears < 1) {
        category = 'terneros';
      } else if (ageYears < 2) {
        category = c.sex === 'macho' ? 'novillos' : 'novillas';
      } else {
        category = c.sex === 'macho' ? 'toros' : 'vacas';
      }

      return {
        code: c.code,
        name: c.name || 'Sin nombre',
        sex: c.sex,
        age_years: ageYears,
        breed: c.breed || 'N/A',
        weight_kg: c.weight_kg || 0,
        estimated_value: c.estimated_value || 0,
        category,
      };
    });

    // Calcular subtotales por categoría
    const categories = {
      terneros: { count: 0, value: 0 },
      novillos: { count: 0, value: 0 },
      vacas: { count: 0, value: 0 },
      toros: { count: 0, value: 0 },
    };

    items.forEach(item => {
      if (item.category in categories) {
        categories[item.category as keyof typeof categories].count++;
        categories[item.category as keyof typeof categories].value += item.estimated_value;
      }
    });

    const totalValue = items.reduce((sum, item) => sum + item.estimated_value, 0);

    return {
      total_animals: items.length,
      total_value: totalValue,
      categories,
      items,
    };
  }

  generateProductionComparisonPDF(data: ProductionSummary, params: ProductionComparisonParams): Uint8Array {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.text('Reporte Comparativo de Producción de Leche', 20, 20);

    // Períodos
    doc.setFontSize(12);
    doc.text(`Período 1: ${params.period1Start} a ${params.period1End}`, 20, 35);
    doc.text(`Período 2: ${params.period2Start} a ${params.period2End}`, 20, 45);

    // Resumen
    doc.text('Resumen:', 20, 60);
    doc.text(`Total Período 1: ${data.period1_total.toFixed(2)} L`, 30, 70);
    doc.text(`Total Período 2: ${data.period2_total.toFixed(2)} L`, 30, 80);
    doc.text(`Diferencia: ${data.difference_absolute.toFixed(2)} L (${data.difference_percentage.toFixed(2)}%)`, 30, 90);

    // Promedios diarios
    doc.text(`Promedio diario P1: ${data.period1_avg_daily.toFixed(2)} L/día`, 30, 100);
    doc.text(`Promedio diario P2: ${data.period2_avg_daily.toFixed(2)} L/día`, 30, 110);

    // Tabla de datos diarios
    let y = 130;
    doc.text('Producción Diaria:', 20, y);
    y += 10;

    data.daily_data.forEach(day => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${day.date}: ${day.period1_liters.toFixed(2)} L | ${day.period2_liters.toFixed(2)} L`, 20, y);
      y += 8;
    });

    return new Uint8Array(doc.output('arraybuffer'));
  }

  generateProductionComparisonExcel(data: ProductionSummary, params: ProductionComparisonParams): Uint8Array {
    const workbook = XLSX.utils.book_new();

    // Hoja de resumen
    const summaryData = [
      ['Reporte Comparativo de Producción de Leche'],
      [''],
      ['Período 1', params.period1Start, 'a', params.period1End],
      ['Período 2', params.period2Start, 'a', params.period2End],
      [''],
      ['Métrica', 'Período 1', 'Período 2', 'Diferencia'],
      ['Total (L)', data.period1_total, data.period2_total, data.difference_absolute],
      ['Días', data.period1_days, data.period2_days, ''],
      ['Promedio diario (L)', data.period1_avg_daily, data.period2_avg_daily, ''],
      ['Diferencia (%)', '', '', data.difference_percentage],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumen');

    // Hoja de datos diarios
    const dailyData = [
      ['Fecha', 'Período 1 (L)', 'Período 2 (L)'],
      ...data.daily_data.map(day => [day.date, day.period1_liters, day.period2_liters])
    ];

    const dailySheet = XLSX.utils.aoa_to_sheet(dailyData);
    XLSX.utils.book_append_sheet(workbook, dailySheet, 'Datos Diarios');

    return XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as Uint8Array;
  }

  generateSanitaryReportPDF(data: SanitaryReportData, startDate: string, endDate: string): Uint8Array {
    const doc = new jsPDF();

    // Encabezado
    doc.setFontSize(14);
    doc.text('REPORTE SANITARIO PARA ICA', 20, 20);
    doc.text(`Período: ${startDate} a ${endDate}`, 20, 30);

    // Datos de la finca
    doc.setFontSize(12);
    doc.text(`Finca: ${data.finca_name}`, 20, 45);
    doc.text(`Propietario: ${data.propietario_name}`, 20, 55);
    doc.text(`Total de animales: ${data.total_animals}`, 20, 65);
    doc.text(`Animales vacunados: ${data.vaccinated_animals}`, 20, 75);

    // Tabla de vacunaciones
    let y = 90;
    doc.text('Detalle de Vacunaciones:', 20, y);
    y += 10;

    data.vaccinations.forEach(vaccination => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(10);
      doc.text(`Código: ${vaccination.cattle_code} - ${vaccination.cattle_name}`, 20, y);
      doc.text(`Vacuna: ${vaccination.vaccine_name} - Dosis: ${vaccination.dose}`, 20, y + 5);
      doc.text(`Fecha: ${vaccination.applied_date} - Veterinario: ${vaccination.veterinarian}`, 20, y + 10);
      y += 18;
    });

    return new Uint8Array(doc.output('arraybuffer'));
  }

  generateFiscalInventoryPDF(data: FiscalInventorySummary): Uint8Array {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(16);
    doc.text('INVENTARIO VALORADO FISCAL', 20, 20);
    doc.text('SIG Bovino - Declaración de Renta', 20, 30);

    // Resumen
    doc.setFontSize(12);
    doc.text(`Total de animales: ${data.total_animals}`, 20, 45);
    doc.text(`Valor total estimado: $${data.total_value.toLocaleString()}`, 20, 55);

    // Subtotales por categoría
    let y = 70;
    doc.text('Subtotales por categoría:', 20, y);
    y += 10;

    Object.entries(data.categories).forEach(([category, stats]) => {
      doc.text(`${category.charAt(0).toUpperCase() + category.slice(1)}: ${stats.count} animales - $${stats.value.toLocaleString()}`, 30, y);
      y += 8;
    });

    // Tabla de inventario
    y += 10;
    doc.text('Detalle del Inventario:', 20, y);
    y += 10;

    data.items.forEach(item => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(10);
      doc.text(`${item.code} - ${item.name} (${item.sex}, ${item.age_years}a, ${item.breed})`, 20, y);
      doc.text(`Peso: ${item.weight_kg}kg - Valor: $${item.estimated_value.toLocaleString()}`, 20, y + 5);
      y += 12;
    });

    return new Uint8Array(doc.output('arraybuffer'));
  }
}