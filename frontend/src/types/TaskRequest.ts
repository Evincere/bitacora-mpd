/**
 * Tipos para las solicitudes de tareas
 */

export enum TaskRequestStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TaskRequestPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  TRIVIAL = 'TRIVIAL'
}

export interface TaskRequestCategory {
  id: number;
  name: string;
  description?: string;
  color: string;
  isDefault: boolean;
}

export interface TaskRequestComment {
  id: number;
  taskRequestId: number;
  userId: number;
  userName?: string;
  content: string;
  createdAt: string;
}

export interface TaskRequestAttachment {
  id: number;
  taskRequestId: number;
  userId: number;
  userName?: string;
  fileName: string;
  fileType?: string;
  filePath: string;
  fileSize?: number;
  uploadedAt: string;
}

export interface TaskRequest {
  id: number;
  title: string;
  description: string;
  category: TaskRequestCategory;
  priority: string;
  dueDate?: string;
  status: string;
  requesterId: number;
  requesterName?: string;
  assignerId?: number;
  assignerName?: string;
  requestDate: string;
  assignmentDate?: string;
  notes?: string;
  attachments?: TaskRequestAttachment[];
  comments?: TaskRequestComment[];
}

export interface TaskRequestPage {
  taskRequests: TaskRequest[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

export interface CreateTaskRequestDto {
  title: string;
  description: string;
  categoryId?: number;
  priority?: string;
  dueDate?: string;
  notes?: string;
  submitImmediately: boolean;
}

export interface UpdateTaskRequestDto {
  title?: string;
  description?: string;
  categoryId?: number;
  priority?: string;
  dueDate?: string;
  notes?: string;
  submit: boolean;
}

export interface TaskRequestCommentCreateDto {
  taskRequestId: number;
  content: string;
}

export interface TaskRequestStats {
  [key: string]: number;
}
