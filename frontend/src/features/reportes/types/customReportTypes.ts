/**
 * Tipo de campo para reportes
 */
export type FieldType = 'string' | 'number' | 'date' | 'boolean' | 'enum';

/**
 * Campo disponible para reportes
 */
export interface ReportField {
  id: string;
  name: string;
  type: FieldType;
  entity: string;
  filterable: boolean;
  sortable: boolean;
  groupable: boolean;
  options?: string[];
  unit?: string;
}

/**
 * Operadores de filtro
 */
export type FilterOperator = 
  'equals' | 
  'notEquals' | 
  'greaterThan' | 
  'lessThan' | 
  'greaterThanOrEqual' | 
  'lessThanOrEqual' | 
  'contains' | 
  'startsWith' | 
  'endsWith' | 
  'in' | 
  'notIn' | 
  'isNull' | 
  'isNotNull' | 
  'between';

/**
 * Filtro para reportes
 */
export interface ReportFilter {
  field: string;
  operator: FilterOperator;
  value: any;
  valueEnd?: any; // Para el operador 'between'
}

/**
 * Dirección de ordenamiento
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Ordenamiento para reportes
 */
export interface ReportSort {
  field: string;
  direction: SortDirection;
}

/**
 * Función de agregación
 */
export type AggregationFunction = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'countDistinct';

/**
 * Agregación para reportes
 */
export interface ReportAggregation {
  field: string;
  function: AggregationFunction;
  alias: string;
}

/**
 * Definición de un reporte
 */
export interface ReportDefinition {
  fields: string[];
  filters: ReportFilter[];
  sortBy?: ReportSort[];
  groupBy?: string[];
  aggregations?: ReportAggregation[];
  limit?: number;
  offset?: number;
}

/**
 * Columna en el resultado de un reporte
 */
export interface ReportColumn {
  id: string;
  name: string;
  type?: FieldType;
}

/**
 * Resultado de un reporte
 */
export interface ReportResult {
  columns: ReportColumn[];
  data: Record<string, any>[];
  totalRows: number;
  executionTime: number;
  groupedData?: {
    groups: string[];
    data: Record<string, any>[];
  };
}

/**
 * Reporte guardado
 */
export interface SavedReport {
  id: string;
  name: string;
  description?: string;
  definition: ReportDefinition;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  favorite?: boolean;
  tags?: string[];
}

/**
 * Plantilla de reporte
 */
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  definition: ReportDefinition;
  category: string;
  icon: string;
}

/**
 * Frecuencia de programación de reportes
 */
export type ScheduleFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

/**
 * Formato de exportación de reportes
 */
export type ReportExportFormat = 'PDF' | 'EXCEL' | 'CSV' | 'JSON';

/**
 * Programación de un reporte
 */
export interface ReportSchedule {
  id: string;
  reportId: string;
  name: string;
  frequency: ScheduleFrequency;
  dayOfWeek?: number; // 0-6, donde 0 es domingo (para frecuencia WEEKLY)
  dayOfMonth?: number; // 1-31 (para frecuencia MONTHLY)
  month?: number; // 1-12 (para frecuencia YEARLY)
  time: string; // HH:MM en formato 24 horas
  recipients: string[]; // Correos electrónicos
  exportFormat: ReportExportFormat;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  nextRunAt?: string;
  lastRunAt?: string;
}

/**
 * Historial de ejecución de reportes programados
 */
export interface ScheduleExecution {
  id: string;
  scheduleId: string;
  reportId: string;
  startTime: string;
  endTime: string;
  status: 'SUCCESS' | 'FAILURE' | 'PARTIAL_SUCCESS';
  errorMessage?: string;
  recipientsSent: string[];
  recipientsFailed?: string[];
}

/**
 * Tipo de visualización para reportes
 */
export type VisualizationType = 'TABLE' | 'BAR_CHART' | 'LINE_CHART' | 'PIE_CHART' | 'AREA_CHART' | 'SCATTER_PLOT';

/**
 * Configuración de visualización para reportes
 */
export interface VisualizationConfig {
  type: VisualizationType;
  title?: string;
  xAxis?: string;
  yAxis?: string;
  series?: string[];
  colorScheme?: string;
  showLegend?: boolean;
  showLabels?: boolean;
  stacked?: boolean;
}

/**
 * Dashboard de reportes
 */
export interface ReportDashboard {
  id: string;
  name: string;
  description?: string;
  widgets: ReportWidget[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  isPublic?: boolean;
}

/**
 * Widget de reporte para dashboard
 */
export interface ReportWidget {
  id: string;
  reportId: string;
  visualization: VisualizationConfig;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  refreshInterval?: number; // En minutos
}

/**
 * Filtros para buscar reportes
 */
export interface ReportSearchFilters {
  query?: string;
  tags?: string[];
  createdBy?: string;
  createdAfter?: string;
  createdBefore?: string;
  favorite?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
}

/**
 * Respuesta paginada de reportes
 */
export interface PaginatedReportsResponse {
  reports: SavedReport[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
