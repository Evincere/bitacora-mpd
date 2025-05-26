import api from '@/utils/api-ky';
import {
  ReportDefinition,
  ReportField,
  ReportFilter,
  ReportResult,
  ReportSchedule,
  ReportTemplate,
  SavedReport,
  ReportExportFormat
} from '../types/customReportTypes';

/**
 * Servicio para interactuar con la API de reportes personalizables
 */
const customReportService = {
  /**
   * Obtiene los campos disponibles para reportes
   * @returns Lista de campos disponibles
   */
  async getAvailableFields(): Promise<ReportField[]> {
    try {
      const response = await api.get('reports/fields').json<ReportField[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener campos disponibles:', error);
      throw error;
    }
  },

  /**
   * Ejecuta un reporte personalizado
   * @param definition Definición del reporte
   * @returns Resultado del reporte
   */
  async executeReport(definition: ReportDefinition): Promise<ReportResult> {
    try {
      const response = await api.post('reports/execute', {
        json: definition
      }).json<ReportResult>();
      return response;
    } catch (error) {
      console.error('Error al ejecutar reporte:', error);
      throw error;
    }
  },

  /**
   * Guarda un reporte personalizado
   * @param report Reporte a guardar
   * @returns Reporte guardado
   */
  async saveReport(report: SavedReport): Promise<SavedReport> {
    try {
      const response = await api.post('reports/save', {
        json: report
      }).json<SavedReport>();
      return response;
    } catch (error) {
      console.error('Error al guardar reporte:', error);
      throw error;
    }
  },

  /**
   * Obtiene los reportes guardados
   * @returns Lista de reportes guardados
   */
  async getSavedReports(): Promise<SavedReport[]> {
    try {
      const response = await api.get('reports/saved').json<SavedReport[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener reportes guardados:', error);
      throw error;
    }
  },

  /**
   * Obtiene un reporte guardado por su ID
   * @param id ID del reporte
   * @returns Reporte guardado
   */
  async getSavedReportById(id: string): Promise<SavedReport> {
    try {
      const response = await api.get(`reports/saved/${id}`).json<SavedReport>();
      return response;
    } catch (error) {
      console.error(`Error al obtener reporte guardado con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza un reporte guardado
   * @param id ID del reporte
   * @param report Datos actualizados del reporte
   * @returns Reporte actualizado
   */
  async updateSavedReport(id: string, report: Partial<SavedReport>): Promise<SavedReport> {
    try {
      const response = await api.put(`reports/saved/${id}`, {
        json: report
      }).json<SavedReport>();
      return response;
    } catch (error) {
      console.error(`Error al actualizar reporte guardado con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un reporte guardado
   * @param id ID del reporte
   * @returns Resultado de la operación
   */
  async deleteSavedReport(id: string): Promise<{ success: boolean }> {
    try {
      const response = await api.delete(`reports/saved/${id}`).json<{ success: boolean }>();
      return response;
    } catch (error) {
      console.error(`Error al eliminar reporte guardado con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene las plantillas de reportes
   * @returns Lista de plantillas de reportes
   */
  async getReportTemplates(): Promise<ReportTemplate[]> {
    try {
      const response = await api.get('reports/templates').json<ReportTemplate[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener plantillas de reportes:', error);
      throw error;
    }
  },

  /**
   * Programa un reporte para ejecución periódica
   * @param schedule Programación del reporte
   * @returns Programación guardada
   */
  async scheduleReport(schedule: ReportSchedule): Promise<ReportSchedule> {
    try {
      const response = await api.post('reports/schedule', {
        json: schedule
      }).json<ReportSchedule>();
      return response;
    } catch (error) {
      console.error('Error al programar reporte:', error);
      throw error;
    }
  },

  /**
   * Obtiene los reportes programados
   * @returns Lista de reportes programados
   */
  async getScheduledReports(): Promise<ReportSchedule[]> {
    try {
      const response = await api.get('reports/schedules').json<ReportSchedule[]>();
      return response;
    } catch (error) {
      console.error('Error al obtener reportes programados:', error);
      throw error;
    }
  },

  /**
   * Actualiza un reporte programado
   * @param id ID del reporte programado
   * @param schedule Datos actualizados del reporte programado
   * @returns Reporte programado actualizado
   */
  async updateScheduledReport(id: string, schedule: Partial<ReportSchedule>): Promise<ReportSchedule> {
    try {
      const response = await api.put(`reports/schedules/${id}`, {
        json: schedule
      }).json<ReportSchedule>();
      return response;
    } catch (error) {
      console.error(`Error al actualizar reporte programado con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un reporte programado
   * @param id ID del reporte programado
   * @returns Resultado de la operación
   */
  async deleteScheduledReport(id: string): Promise<{ success: boolean }> {
    try {
      const response = await api.delete(`reports/schedules/${id}`).json<{ success: boolean }>();
      return response;
    } catch (error) {
      console.error(`Error al eliminar reporte programado con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exporta un reporte en un formato específico
   * @param reportId ID del reporte
   * @param format Formato de exportación
   * @returns URL del archivo exportado
   */
  async exportReport(reportId: string, format: ReportExportFormat): Promise<Blob> {
    try {
      const response = await api.get(`reports/export/${reportId}?format=${format}`).blob();
      return response;
    } catch (error) {
      console.error(`Error al exportar reporte con ID ${reportId}:`, error);
      throw error;
    }
  }
};

export default customReportService;
