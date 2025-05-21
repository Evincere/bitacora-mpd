# Dashboard Structure Diagrams

## Current Structure (Text Representation)

```
Application
│
├── Common Dashboard (/app)
│   ├── Statistics Cards
│   │   ├── Tasks in Progress
│   │   ├── Pending Tasks
│   │   ├── Completed Tasks
│   │   └── Total Tasks
│   │
│   ├── Charts Section
│   │   ├── Activity Type Distribution
│   │   └── Activity Status Distribution
│   │
│   └── Side Section
│       ├── Activity Summary List
│       ├── AI Assistant
│       └── Team Members
│
├── SOLICITANTE Dashboard (/app/solicitudes/dashboard)
│   ├── Statistics Cards
│   │   ├── Pending Requests
│   │   ├── In Progress Requests
│   │   ├── Completed Requests
│   │   └── Average Response Time
│   │
│   ├── Recent Requests
│   ├── Upcoming Deadlines
│   └── Response Time Metrics
│
├── ASIGNADOR Dashboard (/app/asignacion/dashboard)
│   ├── Statistics Cards
│   │   ├── Pending Requests
│   │   ├── Active Executors
│   │   ├── Tasks Assigned Today
│   │   └── Average Assignment Time
│   │
│   ├── Pending Requests
│   ├── Workload Distribution
│   └── Assignment Metrics
│
└── EJECUTOR Dashboard (/app/tareas/dashboard)
    ├── Statistics Cards
    │   ├── Assigned Tasks
    │   ├── Tasks in Progress
    │   ├── Completed Tasks
    │   └── Upcoming Deadlines
    │
    ├── Assigned Tasks
    ├── Tasks in Progress
    └── Calendar
```

## Proposed Structure (Text Representation)

```
Application
│
└── Smart Dashboard (/app)
    │
    ├── Common Components (All Roles)
    │   ├── Header with Role-Based Welcome
    │   ├── Quick Actions Bar
    │   └── Notifications Panel
    │
    ├── SOLICITANTE View
    │   ├── Statistics Cards
    │   │   ├── Pending Requests
    │   │   ├── In Progress Requests
    │   │   ├── Completed Requests
    │   │   └── Average Response Time
    │   │
    │   ├── Recent Requests
    │   ├── Upcoming Deadlines
    │   ├── Response Time Metrics
    │   └── New Request Button (Prominent)
    │
    ├── ASIGNADOR View
    │   ├── Statistics Cards
    │   │   ├── Pending Requests
    │   │   ├── Active Executors
    │   │   ├── Tasks Assigned Today
    │   │   └── Average Assignment Time
    │   │
    │   ├── Pending Requests
    │   ├── Workload Distribution
    │   ├── Assignment Metrics
    │   └── Assign Task Button (Prominent)
    │
    ├── EJECUTOR View
    │   ├── Statistics Cards
    │   │   ├── Assigned Tasks
    │   │   ├── Tasks in Progress
    │   │   ├── Completed Tasks
    │   │   └── Upcoming Deadlines
    │   │
    │   ├── Assigned Tasks
    │   ├── Tasks in Progress
    │   ├── Calendar
    │   └── Update Progress Button (Prominent)
    │
    └── ADMIN View
        ├── System Overview
        │   ├── Total Users
        │   ├── Total Tasks
        │   ├── System Health
        │   └── Recent Activity
        │
        ├── Role-Based Metrics
        │   ├── Solicitante Metrics
        │   ├── Asignador Metrics
        │   └── Ejecutor Metrics
        │
        ├── Configuration Shortcuts
        └── Reports Section
```

## Component Structure for Smart Dashboard

```
SmartDashboard
│
├── DashboardHeader
│   ├── WelcomeMessage (role-based)
│   ├── QuickStats (role-based)
│   └── NotificationsIndicator
│
├── QuickActionsBar (role-based)
│
├── DashboardContent (conditional rendering based on role)
│   │
│   ├── SolicitanteDashboardContent (if role is SOLICITANTE)
│   │   ├── RequestStatisticsCards
│   │   ├── RecentRequestsList
│   │   ├── DeadlinesCalendar
│   │   └── ResponseMetricsChart
│   │
│   ├── AsignadorDashboardContent (if role is ASIGNADOR)
│   │   ├── AssignmentStatisticsCards
│   │   ├── PendingRequestsList
│   │   ├── WorkloadDistributionChart
│   │   └── AssignmentMetricsTable
│   │
│   ├── EjecutorDashboardContent (if role is EJECUTOR)
│   │   ├── TaskStatisticsCards
│   │   ├── AssignedTasksList
│   │   ├── InProgressTasksList
│   │   └── TaskCalendar
│   │
│   └── AdminDashboardContent (if role is ADMIN)
│       ├── SystemOverviewCards
│       ├── RoleMetricsTabs
│       ├── ConfigurationShortcuts
│       └── ReportsSection
│
└── DashboardFooter
    ├── SystemStatus
    └── QuickHelp
```

## Navigation Flow

### Current Navigation Flow

```
Login → Common Dashboard (/app)
       ↓
       ├── SOLICITANTE can navigate to → SOLICITANTE Dashboard (/app/solicitudes/dashboard)
       │
       ├── ASIGNADOR can navigate to → ASIGNADOR Dashboard (/app/asignacion/dashboard)
       │
       └── EJECUTOR can navigate to → EJECUTOR Dashboard (/app/tareas/dashboard)
```

### Proposed Navigation Flow

```
Login → Smart Dashboard (/app) which shows role-appropriate content
       ↓
       ├── SOLICITANTE sees → SOLICITANTE view with relevant actions and data
       │
       ├── ASIGNADOR sees → ASIGNADOR view with relevant actions and data
       │
       ├── EJECUTOR sees → EJECUTOR view with relevant actions and data
       │
       └── ADMIN sees → ADMIN view with system overview and access to all sections
```

## Data Flow

### Current Data Flow

```
Common Dashboard:
- Fetches general statistics for all activities
- Fetches activity type and status distributions
- Fetches recent activities and team members

Role-Specific Dashboards:
- Each dashboard makes separate API calls for role-specific data
- Duplicate data may be fetched multiple times
```

### Proposed Data Flow

```
Smart Dashboard:
- Fetches only the data needed for the current user's role
- Uses shared data fetching hooks for common data
- Implements caching to reduce redundant API calls
- Uses lazy loading for non-critical components
```

This diagram representation provides a clear visualization of both the current structure and the proposed changes, highlighting how the new approach will simplify the user experience while reducing redundancy.
