# Guía de Estilo de Código - Bitácora MPD

## Introducción

Esta guía define los estándares de codificación para el proyecto Bitácora MPD. Seguir estos estándares asegura que el código sea consistente, legible y mantenible por todo el equipo.

## Principios Generales

1. **Legibilidad**: El código debe ser fácil de leer y entender.
2. **Simplicidad**: Preferir soluciones simples sobre complejas cuando sea posible.
3. **Consistencia**: Seguir los mismos patrones y convenciones en todo el código.
4. **Mantenibilidad**: Escribir código pensando en quién lo mantendrá en el futuro.
5. **Testabilidad**: Diseñar el código para que sea fácil de probar.

## Backend (Java)

### Estructura de Archivos

- Un archivo por clase/interfaz/enum
- Nombre del archivo igual al nombre de la clase/interfaz/enum
- Organización de paquetes según la arquitectura hexagonal:
  ```
  com.bitacora
  ├── application
  │   ├── activity
  │   └── user
  ├── domain
  │   ├── event
  │   ├── exception
  │   ├── model
  │   │   ├── activity
  │   │   ├── shared
  │   │   └── user
  │   └── port
  └── infrastructure
      ├── config
      ├── persistence
      └── rest
  ```

### Convenciones de Nomenclatura

- **Clases e Interfaces**: PascalCase (ej. `ActivityService`, `UserRepository`)
- **Métodos y Variables**: camelCase (ej. `getUserById`, `activityList`)
- **Constantes**: UPPER_SNAKE_CASE (ej. `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE`)
- **Paquetes**: minúsculas, sin guiones ni caracteres especiales (ej. `com.bitacora.domain.model`)
- **Archivos de Prueba**: Nombre de la clase + "Test" (ej. `ActivityServiceTest`)

### Formato de Código

- **Indentación**: 4 espacios (no tabs)
- **Longitud máxima de línea**: 120 caracteres
- **Llaves**: Estilo K&R (llave de apertura en la misma línea)
  ```java
  if (condition) {
      // código
  } else {
      // más código
  }
  ```
- **Espacios**:
  - Después de palabras clave (`if`, `for`, `while`, etc.)
  - Alrededor de operadores (`+`, `-`, `*`, `/`, `=`, etc.)
  - Después de comas en listas de parámetros
- **Líneas en blanco**:
  - Entre métodos
  - Entre bloques lógicos de código
  - Después de declaraciones de variables y antes del primer uso

### Comentarios

- Usar Javadoc para todas las clases, interfaces y métodos públicos
- Formato de Javadoc:
  ```java
  /**
   * Breve descripción de lo que hace el método.
   *
   * @param paramName Descripción del parámetro
   * @return Descripción de lo que devuelve
   * @throws ExceptionType Descripción de cuándo se lanza la excepción
   */
  ```
- Evitar comentarios obvios que solo repiten lo que hace el código
- Usar comentarios para explicar el "por qué", no el "qué" o el "cómo"

### Buenas Prácticas

- **Inmutabilidad**: Preferir objetos inmutables cuando sea posible
- **Encapsulamiento**: Usar modificadores de acceso adecuados
- **Excepciones**: Usar excepciones para condiciones excepcionales, no para flujo de control
- **Logging**: Usar SLF4J para logging, con niveles apropiados
- **Validación**: Validar entradas en los límites del sistema
- **Null Safety**: Usar `Optional` para valores que pueden ser nulos
- **Streams**: Usar Streams API para operaciones con colecciones cuando mejore la legibilidad

### Ejemplo de Clase

```java
package com.bitacora.application.activity;

import com.bitacora.domain.model.activity.Activity;
import com.bitacora.domain.port.ActivityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Servicio para gestionar actividades.
 */
@Service
public class ActivityService {

    private static final int DEFAULT_PAGE_SIZE = 10;
    
    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    /**
     * Obtiene una actividad por su ID.
     *
     * @param id ID de la actividad
     * @return La actividad si existe
     */
    @Transactional(readOnly = true)
    public Optional<Activity> getActivityById(Long id) {
        return activityRepository.findById(id);
    }

    /**
     * Crea una nueva actividad.
     *
     * @param activity Actividad a crear
     * @return La actividad creada
     */
    @Transactional
    public Activity createActivity(Activity activity) {
        // Validación de negocio
        validateActivity(activity);
        
        return activityRepository.save(activity);
    }

    private void validateActivity(Activity activity) {
        // Lógica de validación
    }
}
```

## Frontend (TypeScript/React)

### Estructura de Archivos

- Organización por características (feature-based):
  ```
  src/
  ├── components/
  │   ├── common/
  │   ├── layout/
  │   └── ui/
  ├── features/
  │   ├── activities/
  │   ├── auth/
  │   └── dashboard/
  ├── hooks/
  ├── store/
  ├── styles/
  ├── types/
  └── utils/
  ```
- Un componente por archivo
- Archivos de componentes: `.tsx`
- Archivos de lógica: `.ts`
- Archivos de estilos: `.css` o `.styled.ts` (Styled Components)

### Convenciones de Nomenclatura

- **Componentes**: PascalCase (ej. `ActivityList`, `UserProfile`)
- **Hooks**: camelCase, prefijo "use" (ej. `useActivities`, `useAuth`)
- **Funciones y Variables**: camelCase (ej. `fetchData`, `userList`)
- **Tipos e Interfaces**: PascalCase (ej. `Activity`, `UserState`)
- **Archivos de Componentes**: PascalCase (ej. `ActivityList.tsx`)
- **Archivos de Hooks**: camelCase (ej. `useActivities.ts`)
- **Archivos de Prueba**: Nombre del archivo + ".test" (ej. `ActivityList.test.tsx`)

### Formato de Código

- **Indentación**: 2 espacios (no tabs)
- **Longitud máxima de línea**: 100 caracteres
- **Punto y coma**: Obligatorio al final de cada declaración
- **Comillas**: Comillas simples para strings
- **Llaves**: Estilo K&R (llave de apertura en la misma línea)
- **Espacios**:
  - Alrededor de operadores
  - Después de comas
  - Dentro de llaves de objetos
- **Líneas en blanco**:
  - Entre funciones
  - Entre bloques lógicos de código

### Comentarios

- Usar JSDoc para componentes, hooks y funciones importantes
- Formato de JSDoc:
  ```typescript
  /**
   * Breve descripción de lo que hace el componente/función.
   *
   * @param props Descripción de las props
   * @returns Descripción de lo que devuelve
   */
  ```
- Evitar comentarios obvios
- Usar comentarios para explicar decisiones de diseño complejas

### Buenas Prácticas

- **Componentes**:
  - Preferir componentes funcionales con hooks
  - Usar destructuring para props
  - Extraer lógica compleja a hooks personalizados
  - Memoizar componentes y funciones cuando sea necesario

- **Estado**:
  - Usar el estado local (useState) para estado específico de componentes
  - Usar Redux para estado global compartido
  - Usar React Query para datos remotos

- **Tipado**:
  - Tipar todas las props, estados y funciones
  - Evitar `any` cuando sea posible
  - Usar interfaces para objetos con estructura conocida
  - Usar tipos para uniones y tipos más complejos

- **Renderizado**:
  - Evitar renderizado condicional complejo
  - Extraer renderizado condicional a funciones o componentes
  - Usar fragmentos (<>) en lugar de divs innecesarios

- **Estilos**:
  - Preferir Styled Components para estilos
  - Usar temas para colores, espaciado, etc.
  - Evitar estilos inline excepto para valores dinámicos

### Ejemplo de Componente

```tsx
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Activity } from '@/types/models';
import { Button } from '@/components/ui/Button';
import { useActivities } from '@/hooks/useActivities';

interface ActivityListProps {
  initialPage?: number;
  pageSize?: number;
}

/**
 * Componente que muestra una lista paginada de actividades.
 *
 * @param props - Propiedades del componente
 * @returns Componente de lista de actividades
 */
const ActivityList: React.FC<ActivityListProps> = ({
  initialPage = 0,
  pageSize = 10,
}) => {
  const [page, setPage] = useState(initialPage);
  const { data, isLoading, error } = useActivities({ page, size: pageSize });

  const handleNextPage = useCallback(() => {
    if (data && page < data.totalPages - 1) {
      setPage(prevPage => prevPage + 1);
    }
  }, [data, page]);

  const handlePrevPage = useCallback(() => {
    if (page > 0) {
      setPage(prevPage => prevPage - 1);
    }
  }, [page]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <Container>
      <Title>Actividades</Title>
      
      {data?.activities.length === 0 ? (
        <EmptyState>No hay actividades para mostrar</EmptyState>
      ) : (
        <List>
          {data?.activities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </List>
      )}
      
      <Pagination>
        <Button onClick={handlePrevPage} disabled={page === 0}>
          Anterior
        </Button>
        <PageInfo>
          Página {page + 1} de {data?.totalPages || 1}
        </PageInfo>
        <Button 
          onClick={handleNextPage} 
          disabled={!data || page >= data.totalPages - 1}
        >
          Siguiente
        </Button>
      </Pagination>
    </Container>
  );
};

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => (
  <ListItem>
    <ActivityTitle>{activity.description}</ActivityTitle>
    <ActivityMeta>
      <span>{activity.date}</span>
      <span>{activity.type}</span>
      <span>{activity.status}</span>
    </ActivityMeta>
  </ListItem>
);

// Styled Components
const Container = styled.div`
  padding: 1rem;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: ${props => props.theme.textPrimary};
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
`;

const ActivityMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const PageInfo = styled.span`
  color: ${props => props.theme.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.textSecondary};
`;

export default ActivityList;
```

## Herramientas de Verificación

### Backend

- **Checkstyle**: Verificación de estilo de código
- **PMD**: Análisis estático de código
- **SpotBugs**: Detección de bugs potenciales
- **SonarQube**: Análisis de calidad de código

### Frontend

- **ESLint**: Verificación de estilo y errores
- **Prettier**: Formateo automático de código
- **TypeScript**: Verificación de tipos
- **SonarQube**: Análisis de calidad de código

## Configuración de IDE

### IntelliJ IDEA

- Usar el archivo `.editorconfig` para configuración básica
- Importar el estilo de código de Google para Java
- Configurar formateo automático al guardar
- Habilitar optimización de importaciones al guardar

### VS Code

- Instalar extensiones:
  - ESLint
  - Prettier
  - EditorConfig
  - TypeScript
  - Java Extension Pack
- Configurar formateo automático al guardar
- Habilitar "Format on Save"

## Conclusión

Seguir esta guía de estilo asegura que el código sea consistente y mantenible. Si tienes dudas sobre algún aspecto no cubierto en esta guía, consulta con el equipo o sigue las convenciones existentes en el código base.
