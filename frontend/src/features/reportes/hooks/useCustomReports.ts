import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastContext } from '@/components/ui';
import customReportService from '../services/customReportService';
import { 
  ReportDefinition, 
  SavedReport, 
  ReportSchedule, 
  ReportExportFormat 
} from '../types/customReportTypes';

/**
 * Hook para obtener los campos disponibles para reportes
 */
export const useAvailableFields = () => {
  return useQuery({
    queryKey: ['reportFields'],
    queryFn: () => customReportService.getAvailableFields(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para ejecutar un reporte personalizado
 */
export const useExecuteReport = () => {
  const { showError } = useToastContext();

  return useMutation({
    mutationFn: (definition: ReportDefinition) => customReportService.executeReport(definition),
    onError: (error: Error) => {
      showError(`Error al ejecutar reporte: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para guardar un reporte personalizado
 */
export const useSaveReport = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: (report: SavedReport) => customReportService.saveReport(report),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['savedReports'] });
      showSuccess('Reporte guardado correctamente');
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al guardar reporte: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para obtener los reportes guardados
 */
export const useSavedReports = () => {
  return useQuery({
    queryKey: ['savedReports'],
    queryFn: () => customReportService.getSavedReports(),
  });
};

/**
 * Hook para obtener un reporte guardado por su ID
 */
export const useSavedReport = (id: string) => {
  return useQuery({
    queryKey: ['savedReport', id],
    queryFn: () => customReportService.getSavedReportById(id),
    enabled: !!id,
  });
};

/**
 * Hook para actualizar un reporte guardado
 */
export const useUpdateSavedReport = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: ({ id, report }: { id: string; report: Partial<SavedReport> }) => 
      customReportService.updateSavedReport(id, report),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['savedReports'] });
      queryClient.invalidateQueries({ queryKey: ['savedReport', data.id] });
      showSuccess('Reporte actualizado correctamente');
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al actualizar reporte: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para eliminar un reporte guardado
 */
export const useDeleteSavedReport = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: (id: string) => customReportService.deleteSavedReport(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['savedReports'] });
      queryClient.removeQueries({ queryKey: ['savedReport', id] });
      showSuccess('Reporte eliminado correctamente');
    },
    onError: (error: Error) => {
      showError(`Error al eliminar reporte: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para obtener las plantillas de reportes
 */
export const useReportTemplates = () => {
  return useQuery({
    queryKey: ['reportTemplates'],
    queryFn: () => customReportService.getReportTemplates(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para programar un reporte
 */
export const useScheduleReport = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: (schedule: ReportSchedule) => customReportService.scheduleReport(schedule),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['scheduledReports'] });
      showSuccess('Reporte programado correctamente');
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al programar reporte: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para obtener los reportes programados
 */
export const useScheduledReports = () => {
  return useQuery({
    queryKey: ['scheduledReports'],
    queryFn: () => customReportService.getScheduledReports(),
  });
};

/**
 * Hook para actualizar un reporte programado
 */
export const useUpdateScheduledReport = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: ({ id, schedule }: { id: string; schedule: Partial<ReportSchedule> }) => 
      customReportService.updateScheduledReport(id, schedule),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['scheduledReports'] });
      showSuccess('Programación actualizada correctamente');
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al actualizar programación: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para eliminar un reporte programado
 */
export const useDeleteScheduledReport = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: (id: string) => customReportService.deleteScheduledReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledReports'] });
      showSuccess('Programación eliminada correctamente');
    },
    onError: (error: Error) => {
      showError(`Error al eliminar programación: ${error.message}`);
      throw error;
    },
  });
};

/**
 * Hook para exportar un reporte
 */
export const useExportReport = () => {
  const { showSuccess, showError } = useToastContext();

  return useMutation({
    mutationFn: ({ reportId, format }: { reportId: string; format: ReportExportFormat }) => 
      customReportService.exportReport(reportId, format),
    onSuccess: (data, { format }) => {
      // Crear un enlace de descarga
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showSuccess(`Reporte exportado correctamente en formato ${format}`);
      return data;
    },
    onError: (error: Error) => {
      showError(`Error al exportar reporte: ${error.message}`);
      throw error;
    },
  });
};
