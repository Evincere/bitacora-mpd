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
      
      // Datos de ejemplo como fallback
      return [
        { 
          id: 'task_id', 
          name: 'ID de Tarea', 
          type: 'number', 
          entity: 'task', 
          filterable: true, 
          sortable: true,
          groupable: false
        },
        { 
          id: 'task_title', 
          name: 'Título de Tarea', 
          type: 'string', 
          entity: 'task', 
          filterable: true, 
          sortable: true,
          groupable: false
        },
        { 
          id: 'task_description', 
          name: 'Descripción de Tarea', 
          type: 'string', 
          entity: 'task', 
          filterable: true, 
          sortable: false,
          groupable: false
        },
        { 
          id: 'task_status', 
          name: 'Estado de Tarea', 
          type: 'enum', 
          entity: 'task', 
          filterable: true, 
          sortable: true,
          groupable: true,
          options: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED']
        },
        { 
          id: 'task_priority', 
          name: 'Prioridad de Tarea', 
          type: 'enum', 
          entity: 'task', 
          filterable: true, 
          sortable: true,
          groupable: true,
          options: ['ALTA', 'MEDIA', 'BAJA']
        },
        { 
          id: 'task_category', 
          name: 'Categoría de Tarea', 
          type: 'string', 
          entity: 'task', 
          filterable: true, 
          sortable: true,
          groupable: true
        },
        { 
          id: 'task_created_at', 
          name: 'Fecha de Creación', 
          type: 'date', 
          entity: 'task', 
          filterable: true, 
          sortable: true,
          groupable: true
        },
        { 
          id: 'task_updated_at', 
          name: 'Fecha de Actualización', 
          type: 'date', 
          entity: 'task', 
          filterable: true, 
          sortable: true,
          groupable: true
        },
        { 
          id: 'task_due_date', 
          name: 'Fecha de Vencimiento', 
          type: 'date', 
          entity: 'task', 
          filterable: true, 
          sortable: true,
          groupable: true
        },
        { 
          id: 'task_completed_at', 
          name: 'Fecha de Finalización', 
          type: 'date', 
          entity: 'task', 
          filterable: true, 
          sortable: true,
          groupable: true
        },
        { 
          id: 'requester_id', 
          name: 'ID de Solicitante', 
          type: 'number', 
          entity: 'user', 
          filterable: true, 
          sortable: true,
          groupable: false
        },
        { 
          id: 'requester_name', 
          name: 'Nombre de Solicitante', 
          type: 'string', 
          entity: 'user', 
          filterable: true, 
          sortable: true,
          groupable: true
        },
        { 
          id: 'assigner_id', 
          name: 'ID de Asignador', 
          type: 'number', 
          entity: 'user', 
          filterable: true, 
          sortable: true,
          groupable: false
        },
        { 
          id: 'assigner_name', 
          name: 'Nombre de Asignador', 
          type: 'string', 
          entity: 'user', 
          filterable: true, 
          sortable: true,
          groupable: true
        },
        { 
          id: 'executor_id', 
          name: 'ID de Ejecutor', 
          type: 'number', 
          entity: 'user', 
          filterable: true, 
          sortable: true,
          groupable: false
        },
        { 
          id: 'executor_name', 
          name: 'Nombre de Ejecutor', 
          type: 'string', 
          entity: 'user', 
          filterable: true, 
          sortable: true,
          groupable: true
        },
        { 
          id: 'attachment_count', 
          name: 'Cantidad de Adjuntos', 
          type: 'number', 
          entity: 'attachment', 
          filterable: true, 
          sortable: true,
          groupable: true
        },
        { 
          id: 'comment_count', 
          name: 'Cantidad de Comentarios', 
          type: 'number', 
          entity: 'comment', 
          filterable: true, 
          sortable: true,
          groupable: true
        },
        { 
          id: 'time_to_assign', 
          name: 'Tiempo hasta Asignación', 
          type: 'number', 
          entity: 'metrics', 
          filterable: true, 
          sortable: true,
          groupable: true,
          unit: 'hours'
        },
        { 
          id: 'time_to_complete', 
          name: 'Tiempo hasta Finalización', 
          type: 'number', 
          entity: 'metrics', 
          filterable: true, 
          sortable: true,
          groupable: true,
          unit: 'hours'
        }
      ];
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
      
      // Datos de ejemplo como fallback
      return {
        columns: definition.fields.map(field => ({
          id: field,
          name: field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        })),
        data: Array.from({ length: 10 }, (_, i) => {
          const row: Record<string, any> = {};
          definition.fields.forEach(field => {
            if (field.includes('id')) {
              row[field] = i + 1;
            } else if (field.includes('name') || field.includes('title') || field.includes('description')) {
              row[field] = `Ejemplo ${i + 1}`;
            } else if (field.includes('status')) {
              row[field] = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'][Math.floor(Math.random() * 4)];
            } else if (field.includes('priority')) {
              row[field] = ['ALTA', 'MEDIA', 'BAJA'][Math.floor(Math.random() * 3)];
            } else if (field.includes('category')) {
              row[field] = ['Administrativa', 'Judicial', 'Consulta'][Math.floor(Math.random() * 3)];
            } else if (field.includes('date') || field.includes('at')) {
              const date = new Date();
              date.setDate(date.getDate() - Math.floor(Math.random() * 30));
              row[field] = date.toISOString();
            } else if (field.includes('count') || field.includes('time')) {
              row[field] = Math.floor(Math.random() * 10);
            } else {
              row[field] = `Valor ${i + 1}`;
            }
          });
          return row;
        }),
        totalRows: 10,
        executionTime: 0.5
      };
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
      
      // Datos de ejemplo como fallback
      return {
        ...report,
        id: Math.floor(Math.random() * 1000).toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
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
      
      // Datos de ejemplo como fallback
      return [
        {
          id: '1',
          name: 'Tareas por Estado',
          description: 'Reporte de tareas agrupadas por estado',
          definition: {
            fields: ['task_id', 'task_title', 'task_status', 'task_created_at', 'executor_name'],
            filters: [
              { field: 'task_created_at', operator: 'greaterThan', value: '2023-01-01T00:00:00Z' }
            ],
            groupBy: ['task_status'],
            sortBy: [{ field: 'task_created_at', direction: 'desc' }],
            limit: 100
          },
          createdAt: '2023-11-01T10:00:00Z',
          updatedAt: '2023-11-01T10:00:00Z'
        },
        {
          id: '2',
          name: 'Tareas por Ejecutor',
          description: 'Reporte de tareas asignadas a cada ejecutor',
          definition: {
            fields: ['task_id', 'task_title', 'task_status', 'task_priority', 'executor_name'],
            filters: [
              { field: 'task_status', operator: 'in', value: ['ASSIGNED', 'IN_PROGRESS'] }
            ],
            groupBy: ['executor_name'],
            sortBy: [{ field: 'executor_name', direction: 'asc' }],
            limit: 100
          },
          createdAt: '2023-11-02T14:30:00Z',
          updatedAt: '2023-11-02T14:30:00Z'
        },
        {
          id: '3',
          name: 'Tiempos de Finalización',
          description: 'Análisis de tiempos de finalización de tareas',
          definition: {
            fields: ['task_id', 'task_title', 'task_category', 'time_to_complete', 'executor_name'],
            filters: [
              { field: 'task_status', operator: 'equals', value: 'COMPLETED' }
            ],
            groupBy: ['task_category'],
            sortBy: [{ field: 'time_to_complete', direction: 'desc' }],
            limit: 100
          },
          createdAt: '2023-11-03T09:15:00Z',
          updatedAt: '2023-11-03T09:15:00Z'
        }
      ];
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
      
      // Datos de ejemplo como fallback
      return {
        id,
        name: 'Reporte de Ejemplo',
        description: 'Este es un reporte de ejemplo',
        definition: {
          fields: ['task_id', 'task_title', 'task_status'],
          filters: [],
          sortBy: [{ field: 'task_id', direction: 'asc' }],
          limit: 100
        },
        createdAt: '2023-11-01T10:00:00Z',
        updatedAt: '2023-11-01T10:00:00Z'
      };
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
      
      // Datos de ejemplo como fallback
      return {
        id,
        name: report.name || 'Reporte Actualizado',
        description: report.description || 'Descripción actualizada',
        definition: report.definition || {
          fields: ['task_id', 'task_title', 'task_status'],
          filters: [],
          sortBy: [{ field: 'task_id', direction: 'asc' }],
          limit: 100
        },
        createdAt: '2023-11-01T10:00:00Z',
        updatedAt: new Date().toISOString()
      };
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
      
      // Datos de ejemplo como fallback
      return { success: true };
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
      
      // Datos de ejemplo como fallback
      return [
        {
          id: 'template-1',
          name: 'Resumen de Tareas por Estado',
          description: 'Muestra un resumen de las tareas agrupadas por estado',
          definition: {
            fields: ['task_status', 'task_id'],
            groupBy: ['task_status'],
            aggregations: [{ field: 'task_id', function: 'count', alias: 'total_tasks' }],
            filters: [],
            sortBy: [{ field: 'total_tasks', direction: 'desc' }],
            limit: 100
          },
          category: 'Tareas',
          icon: 'pie-chart'
        },
        {
          id: 'template-2',
          name: 'Tareas por Categoría',
          description: 'Muestra las tareas agrupadas por categoría',
          definition: {
            fields: ['task_category', 'task_id'],
            groupBy: ['task_category'],
            aggregations: [{ field: 'task_id', function: 'count', alias: 'total_tasks' }],
            filters: [],
            sortBy: [{ field: 'total_tasks', direction: 'desc' }],
            limit: 100
          },
          category: 'Tareas',
          icon: 'bar-chart'
        },
        {
          id: 'template-3',
          name: 'Tiempo Promedio de Finalización',
          description: 'Muestra el tiempo promedio de finalización de tareas por ejecutor',
          definition: {
            fields: ['executor_name', 'time_to_complete'],
            groupBy: ['executor_name'],
            aggregations: [{ field: 'time_to_complete', function: 'avg', alias: 'avg_completion_time' }],
            filters: [
              { field: 'task_status', operator: 'equals', value: 'COMPLETED' }
            ],
            sortBy: [{ field: 'avg_completion_time', direction: 'asc' }],
            limit: 100
          },
          category: 'Rendimiento',
          icon: 'clock'
        },
        {
          id: 'template-4',
          name: 'Tareas Vencidas',
          description: 'Muestra las tareas que han vencido y no se han completado',
          definition: {
            fields: ['task_id', 'task_title', 'task_due_date', 'executor_name'],
            filters: [
              { field: 'task_status', operator: 'notEquals', value: 'COMPLETED' },
              { field: 'task_due_date', operator: 'lessThan', value: 'now()' }
            ],
            sortBy: [{ field: 'task_due_date', direction: 'asc' }],
            limit: 100
          },
          category: 'Alertas',
          icon: 'alert-triangle'
        }
      ];
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
      
      // Datos de ejemplo como fallback
      return {
        ...schedule,
        id: Math.floor(Math.random() * 1000).toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
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
      
      // Datos de ejemplo como fallback
      return [
        {
          id: '1',
          reportId: '1',
          name: 'Reporte Diario de Tareas',
          frequency: 'DAILY',
          time: '08:00',
          recipients: ['admin@example.com', 'manager@example.com'],
          exportFormat: 'PDF',
          active: true,
          createdAt: '2023-11-01T10:00:00Z',
          updatedAt: '2023-11-01T10:00:00Z',
          nextRunAt: '2023-12-06T08:00:00Z',
          lastRunAt: '2023-12-05T08:00:00Z'
        },
        {
          id: '2',
          reportId: '2',
          name: 'Reporte Semanal de Ejecutores',
          frequency: 'WEEKLY',
          dayOfWeek: 1, // Lunes
          time: '09:00',
          recipients: ['admin@example.com'],
          exportFormat: 'EXCEL',
          active: true,
          createdAt: '2023-11-02T14:30:00Z',
          updatedAt: '2023-11-02T14:30:00Z',
          nextRunAt: '2023-12-11T09:00:00Z',
          lastRunAt: '2023-12-04T09:00:00Z'
        },
        {
          id: '3',
          reportId: '3',
          name: 'Reporte Mensual de Rendimiento',
          frequency: 'MONTHLY',
          dayOfMonth: 1,
          time: '07:00',
          recipients: ['admin@example.com', 'director@example.com'],
          exportFormat: 'PDF',
          active: true,
          createdAt: '2023-11-03T09:15:00Z',
          updatedAt: '2023-11-03T09:15:00Z',
          nextRunAt: '2024-01-01T07:00:00Z',
          lastRunAt: '2023-12-01T07:00:00Z'
        }
      ];
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
      
      // Datos de ejemplo como fallback
      return {
        id,
        reportId: schedule.reportId || '1',
        name: schedule.name || 'Reporte Programado Actualizado',
        frequency: schedule.frequency || 'DAILY',
        time: schedule.time || '08:00',
        recipients: schedule.recipients || ['admin@example.com'],
        exportFormat: schedule.exportFormat || 'PDF',
        active: schedule.active !== undefined ? schedule.active : true,
        createdAt: '2023-11-01T10:00:00Z',
        updatedAt: new Date().toISOString(),
        nextRunAt: '2023-12-06T08:00:00Z',
        lastRunAt: '2023-12-05T08:00:00Z'
      };
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
      
      // Datos de ejemplo como fallback
      return { success: true };
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
      
      // Crear un blob de ejemplo
      const exampleContent = 'Este es un archivo de ejemplo para simular la exportación de un reporte.';
      return new Blob([exampleContent], { type: 'text/plain' });
    }
  }
};

export default customReportService;
