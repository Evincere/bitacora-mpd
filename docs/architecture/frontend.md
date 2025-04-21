# Arquitectura del Frontend - Bitácora MPD

## Visión General

El frontend de Bitácora MPD está implementado como una Single Page Application (SPA) utilizando React con TypeScript. La arquitectura sigue un enfoque modular basado en características (feature-based), con una clara separación de responsabilidades y un fuerte énfasis en la reutilización de componentes.

## Estructura de Directorios

```
frontend/
├── public/                 # Archivos estáticos
├── src/                    # Código fuente
│   ├── assets/             # Recursos estáticos (imágenes, fuentes, etc.)
│   ├── components/         # Componentes reutilizables
│   │   ├── common/         # Componentes genéricos (botones, inputs, etc.)
│   │   ├── layout/         # Componentes de estructura (header, sidebar, etc.)
│   │   └── ui/             # Componentes de UI (modales, tooltips, etc.)
│   ├── features/           # Módulos organizados por funcionalidad
│   │   ├── activities/     # Funcionalidad relacionada con actividades
│   │   ├── auth/           # Autenticación y autorización
│   │   ├── dashboard/      # Dashboard y visualizaciones
│   │   └── profile/        # Gestión de perfil de usuario
│   ├── hooks/              # Hooks personalizados
│   ├── store/              # Estado global (Redux)
│   │   ├── slices/         # Slices de Redux Toolkit
│   │   └── index.ts        # Configuración del store
│   ├── styles/             # Estilos globales y temas
│   ├── types/              # Definiciones de TypeScript
│   │   ├── api.ts          # Tipos para API
│   │   ├── models.ts       # Interfaces de dominio
│   │   └── store.ts        # Tipos para el estado global
│   ├── utils/              # Utilidades y helpers
│   │   ├── api.ts          # Cliente HTTP y funciones de API
│   │   ├── formatters.ts   # Funciones de formato (fechas, números, etc.)
│   │   └── validators.ts   # Funciones de validación
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Punto de entrada
├── .eslintrc.json          # Configuración de ESLint
├── package.json            # Dependencias y scripts
├── tsconfig.json           # Configuración de TypeScript
└── vite.config.ts          # Configuración de Vite
```

## Arquitectura de Componentes

La arquitectura del frontend sigue un enfoque de componentes con las siguientes capas:

### 1. Componentes de UI

Componentes reutilizables que forman los bloques básicos de la interfaz:

- **Componentes Atómicos**: Botones, inputs, iconos, etc.
- **Componentes Moleculares**: Formularios, tarjetas, tablas, etc.
- **Componentes Organísmicos**: Secciones completas, paneles, etc.

Características clave:
- Altamente reutilizables
- No contienen lógica de negocio
- Reciben props y emiten eventos

### 2. Componentes de Características (Features)

Componentes específicos para cada funcionalidad de la aplicación:

- **Páginas**: Componentes de nivel superior que representan rutas
- **Contenedores**: Componentes que conectan con el estado global
- **Componentes de Característica**: Componentes específicos para una característica

Características clave:
- Organizados por dominio funcional
- Pueden contener lógica de negocio
- Utilizan componentes de UI para construir interfaces complejas

### 3. Servicios y Utilidades

Funcionalidad compartida entre componentes:

- **Servicios de API**: Comunicación con el backend
- **Hooks Personalizados**: Lógica reutilizable
- **Utilidades**: Funciones helper para tareas comunes

## Gestión de Estado

La gestión de estado sigue un enfoque híbrido:

### 1. Estado Global (Redux)

Utilizado para estado que debe ser accesible en toda la aplicación:

- **Autenticación**: Estado del usuario actual
- **UI Global**: Temas, notificaciones, etc.
- **Datos Compartidos**: Datos utilizados por múltiples componentes

Implementado con Redux Toolkit para reducir el boilerplate:

```typescript
// store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});
```

### 2. Estado de Servidor (React Query)

Utilizado para datos que provienen del servidor:

- **Datos de API**: Resultados de llamadas a API
- **Caché**: Almacenamiento en caché de datos remotos
- **Estado de Carga**: Loading, error, etc.

Implementado con React Query para simplificar la gestión de datos remotos:

```typescript
// hooks/useActivities.ts
import { useQuery } from '@tanstack/react-query';
import { getActivities } from '../services/api';

export const useActivities = (params) => {
  return useQuery(['activities', params], () => getActivities(params));
};
```

### 3. Estado Local (useState/useReducer)

Utilizado para estado específico de un componente:

- **Estado de Formulario**: Valores de inputs, validación, etc.
- **Estado de UI**: Expansión/colapso, selección, etc.
- **Estado Temporal**: Datos que no necesitan persistencia

## Routing

El enrutamiento se implementa utilizando React Router:

- **Rutas Públicas**: Accesibles sin autenticación
- **Rutas Protegidas**: Requieren autenticación
- **Rutas Anidadas**: Para layouts compartidos
- **Lazy Loading**: Carga diferida de componentes por ruta

```typescript
// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./features/dashboard/Dashboard'));
const Activities = lazy(() => import('./features/activities/Activities'));

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="activities" element={<Activities />} />
      </Route>
    </Routes>
  );
}
```

## Comunicación con el Backend

La comunicación con el backend se realiza a través de una capa de servicios:

- **Cliente HTTP**: Basado en Axios con interceptores para manejo de tokens
- **Servicios de API**: Funciones para cada endpoint
- **Manejo de Errores**: Centralizado en interceptores

```typescript
// utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// services/activityService.ts
import api from '../utils/api';
import { Activity, ActivityCreateDTO } from '../types/models';

export const getActivities = async (params) => {
  const response = await api.get('/activities', { params });
  return response.data;
};

export const createActivity = async (data: ActivityCreateDTO) => {
  const response = await api.post('/activities', data);
  return response.data;
};
```

## Estilos y Temas

Los estilos se implementan utilizando Styled Components:

- **Temas**: Soporte para modo claro/oscuro
- **Componentes Estilizados**: Estilos encapsulados en componentes
- **Variables CSS**: Para colores, espaciado, etc.

```typescript
// styles/theme.ts
export const lightTheme = {
  primary: '#3498db',
  background: '#ffffff',
  text: '#333333',
  // ...
};

export const darkTheme = {
  primary: '#2980b9',
  background: '#1a1a1a',
  text: '#f5f5f5',
  // ...
};

// components/Button.tsx
import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.primaryDark};
  }
`;
```

## Optimización de Rendimiento

Se implementan varias técnicas para optimizar el rendimiento:

- **Code Splitting**: División del código por rutas y componentes
- **Lazy Loading**: Carga diferida de componentes
- **Memoización**: Uso de React.memo, useMemo y useCallback
- **Virtualización**: Para listas largas
- **Optimización de Imágenes**: Compresión y formatos modernos

```typescript
// Ejemplo de memoización
import { useMemo } from 'react';

function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(item => /* procesamiento costoso */);
  }, [data]);
  
  return <div>{processedData}</div>;
}
```

## Manejo de Formularios

Los formularios se implementan utilizando un enfoque controlado:

- **Estado de Formulario**: Gestionado con useState o bibliotecas como Formik
- **Validación**: Implementada con Yup o funciones personalizadas
- **Feedback**: Mensajes de error y éxito

```typescript
// Ejemplo con useState
function SimpleForm() {
  const [values, setValues] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación y envío
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={values.name} onChange={handleChange} />
      {errors.name && <span>{errors.name}</span>}
      <input name="email" value={values.email} onChange={handleChange} />
      {errors.email && <span>{errors.email}</span>}
      <button type="submit">Enviar</button>
    </form>
  );
}
```

## Internacionalización

La aplicación está preparada para internacionalización:

- **Textos Externalizados**: Todos los textos se definen en archivos de traducción
- **Formato de Fechas y Números**: Adaptado a la localización del usuario
- **Dirección de Texto**: Soporte para idiomas RTL (right-to-left)

## Accesibilidad

Se siguen las mejores prácticas de accesibilidad:

- **Semántica HTML**: Uso correcto de elementos HTML
- **ARIA**: Atributos para mejorar la accesibilidad
- **Contraste**: Colores con suficiente contraste
- **Navegación por Teclado**: Soporte para uso sin ratón

## Testing

La arquitectura facilita las pruebas:

- **Pruebas Unitarias**: Para componentes y funciones
- **Pruebas de Integración**: Para flujos completos
- **Pruebas de Snapshot**: Para verificar la UI
- **Pruebas de Accesibilidad**: Para verificar la accesibilidad

## Consideraciones de Seguridad

- **Sanitización de Datos**: Prevención de XSS
- **CSRF**: Protección contra ataques CSRF
- **Content Security Policy**: Restricciones para recursos externos
- **Manejo Seguro de Tokens**: Almacenamiento y renovación seguros

## Conclusión

La arquitectura del frontend de Bitácora MPD está diseñada para ser modular, mantenible y escalable. La separación de responsabilidades, la reutilización de componentes y el uso de TypeScript proporcionan una base sólida para el desarrollo y evolución de la aplicación.
