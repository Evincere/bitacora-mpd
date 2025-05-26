/**
 * @file Archivo de exportación para componentes de UI
 * @description Este archivo exporta los componentes de UI desde shared/components/ui y componentes locales
 */

// Exportar componentes desde shared/components/ui
export {
  StatusBadge,
  TypeBadge,
  PageTransition,
  AnimatedRoutes,
  NotFound,
  ToastProvider,
  useToast
} from '@/shared/components/ui';

// Exportar componentes locales
export { default as Button } from './Button';
export { default as Card } from './Card';
export { Skeleton, TextSkeleton, CircleSkeleton, RectSkeleton } from './Skeleton';
export {
  ActivityCardSkeleton,
  ActivitiesListSkeleton,
  ActivityDetailSkeleton,
  ActivityFormSkeleton,
  ProfileSkeleton,
  TableSkeleton,
  UserListSkeleton
} from './Skeleton';
export { default as Badge } from './Badge';
export { default as Pagination } from './Pagination';
export { default as EmptyState } from './EmptyState';
