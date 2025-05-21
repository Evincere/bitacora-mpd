# Smart Dashboard Architecture

## Overview

The Smart Dashboard architecture is designed to provide a unified, role-based dashboard experience that eliminates redundancy and improves user experience. This document outlines the technical architecture, component structure, and implementation strategy for the new dashboard system.

## Core Principles

1. **Single Entry Point**: One dashboard that adapts to the user's role
2. **Role-Based Content**: Show only relevant information based on user's role
3. **Component Reusability**: Maximize reuse of components across different role views
4. **Performance Optimization**: Minimize redundant data fetching and rendering
5. **Maintainability**: Simplify code structure for easier maintenance

## Technical Architecture

### Component Hierarchy

```
SmartDashboard (Container)
│
├── DashboardHeader (Common)
│   ├── WelcomeMessage
│   ├── QuickStats
│   └── NotificationsIndicator
│
├── QuickActionsBar (Role-Based)
│
├── DashboardContent (Role-Based Container)
│   │
│   ├── SolicitanteDashboardContent
│   ├── AsignadorDashboardContent
│   ├── EjecutorDashboardContent
│   └── AdminDashboardContent
│
└── DashboardFooter (Common)
```

### Shared Components

1. **StatisticsCard**: Reusable card component for displaying statistics
   - Props: `title`, `value`, `icon`, `trend`, `trendLabel`, `color`

2. **TaskList**: Reusable list component for displaying tasks/requests
   - Props: `items`, `type` (assigned, in-progress, completed), `onItemClick`, `emptyMessage`

3. **MetricsChart**: Reusable chart component for displaying metrics
   - Props: `data`, `type` (pie, bar, line), `title`, `labels`, `colors`

4. **Calendar**: Reusable calendar component for displaying deadlines
   - Props: `events`, `onDateClick`, `onEventClick`

5. **ActionButton**: Prominent button for primary actions
   - Props: `label`, `icon`, `onClick`, `variant`

### Role-Based Components

1. **SolicitanteDashboardContent**:
   - RequestStatisticsCards
   - RecentRequestsList
   - DeadlinesCalendar
   - ResponseMetricsChart

2. **AsignadorDashboardContent**:
   - AssignmentStatisticsCards
   - PendingRequestsList
   - WorkloadDistributionChart
   - AssignmentMetricsTable

3. **EjecutorDashboardContent**:
   - TaskStatisticsCards
   - AssignedTasksList
   - InProgressTasksList
   - TaskCalendar

4. **AdminDashboardContent**:
   - SystemOverviewCards
   - RoleMetricsTabs
   - ConfigurationShortcuts
   - ReportsSection

## Data Management

### Data Hooks

1. **useSmartDashboardData**: Main hook that orchestrates data fetching based on role
   - Returns: `{ loading, error, data }`
   - Internally calls role-specific hooks

2. **useSolicitanteData**: Hook for fetching SOLICITANTE-specific data
   - Returns: `{ requests, metrics, deadlines }`

3. **useAsignadorData**: Hook for fetching ASIGNADOR-specific data
   - Returns: `{ pendingRequests, workload, metrics }`

4. **useEjecutorData**: Hook for fetching EJECUTOR-specific data
   - Returns: `{ assignedTasks, inProgressTasks, calendar }`

5. **useAdminData**: Hook for fetching ADMIN-specific data
   - Returns: `{ systemStats, roleMetrics, recentActivity }`

### Caching Strategy

1. Use React Query for data fetching and caching
2. Implement stale-while-revalidate pattern for frequently changing data
3. Cache static data with longer TTL (Time To Live)
4. Implement optimistic updates for user actions

## Routing Strategy

### Route Structure

```
/app - Smart Dashboard (main entry point)
  ├── Renders role-appropriate content automatically
  ├── No need for separate dashboard routes
  └── Other functional routes remain unchanged
```

### Navigation Updates

1. Update `RoleBasedSidebar.tsx` to remove links to role-specific dashboards
2. Keep the main dashboard link as the primary entry point
3. Maintain other functional links (forms, lists, etc.)

## Implementation Strategy

### Phase 1: Core Structure

1. Create `SmartDashboard` container component
2. Implement role detection logic
3. Create skeleton for role-based content components
4. Update routing to use the new dashboard

### Phase 2: Shared Components

1. Extract and refactor common components from existing dashboards
2. Implement shared data hooks
3. Create reusable UI components (cards, lists, charts)

### Phase 3: Role-Based Content

1. Implement role-specific content components
2. Connect to data hooks
3. Add role-specific actions and functionality

### Phase 4: Navigation and Integration

1. Update sidebar navigation
2. Integrate with existing functionality
3. Ensure smooth transitions between views

## Performance Considerations

1. **Lazy Loading**: Load role-specific components only when needed
2. **Code Splitting**: Split code by role to reduce initial bundle size
3. **Optimized Rendering**: Use React.memo and useMemo for expensive computations
4. **Efficient Data Fetching**: Fetch only the data needed for the current role

## Accessibility Considerations

1. Ensure all components meet WCAG 2.1 AA standards
2. Implement keyboard navigation for all interactive elements
3. Use semantic HTML elements
4. Provide appropriate ARIA attributes

## Testing Strategy

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions
3. **Role-Based Tests**: Test dashboard rendering for each role
4. **Performance Tests**: Measure and optimize loading times

## Migration Plan

1. Implement the new dashboard alongside existing dashboards
2. Gradually redirect users to the new dashboard
3. Collect feedback and make adjustments
4. Once stable, remove old dashboard components

This architecture provides a solid foundation for implementing the Smart Dashboard while ensuring maintainability, performance, and a great user experience.
