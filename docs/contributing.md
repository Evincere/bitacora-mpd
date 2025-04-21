# Guía de Contribución - Bitácora MPD

## Introducción

¡Gracias por tu interés en contribuir al proyecto Bitácora MPD! Esta guía te ayudará a entender el proceso de contribución y los estándares que seguimos en el desarrollo.

## Configuración del Entorno de Desarrollo

### Requisitos Previos

- Java 21 JDK
- Node.js 20+
- PostgreSQL 14+
- Maven 3.8+
- Git
- IDE recomendado: IntelliJ IDEA o VS Code

### Pasos para Configurar el Entorno

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Evincere/bitacora-mpd.git
   cd bitacora-mpd
   ```

2. **Configurar el Backend**:
   ```bash
   cd backend
   
   # Crear archivo de propiedades local (si es necesario)
   cp src/main/resources/application.yml src/main/resources/application-local.yml
   
   # Instalar dependencias
   ./mvnw clean install -DskipTests
   
   # Ejecutar pruebas
   ./mvnw test
   
   # Iniciar la aplicación
   ./mvnw spring-boot:run
   ```

3. **Configurar el Frontend**:
   ```bash
   cd frontend
   
   # Instalar dependencias
   npm install
   
   # Ejecutar pruebas
   npm run test
   
   # Iniciar la aplicación en modo desarrollo
   npm run dev
   ```

4. **Configurar la Base de Datos**:
   - Para desarrollo, puedes usar la base de datos H2 en memoria (configurada por defecto)
   - Para un entorno más cercano a producción, configura PostgreSQL:
     ```
     # En application-local.yml
     spring:
       datasource:
         url: jdbc:postgresql://localhost:5432/bitacoradb
         username: tu_usuario
         password: tu_contraseña
     ```

## Flujo de Trabajo de Desarrollo

Seguimos un flujo de trabajo basado en Git Flow:

1. **Crear una Rama**:
   - Para nuevas características: `feature/nombre-de-la-caracteristica`
   - Para correcciones de errores: `bugfix/descripcion-del-error`
   - Para mejoras de rendimiento: `performance/descripcion-de-la-mejora`
   - Para refactorizaciones: `refactor/descripcion-de-la-refactorizacion`

   ```bash
   git checkout -b feature/mi-nueva-caracteristica
   ```

2. **Realizar Cambios**:
   - Escribe código que siga los estándares del proyecto
   - Añade pruebas para tus cambios
   - Asegúrate de que todas las pruebas pasen

3. **Commit de Cambios**:
   - Usa mensajes de commit descriptivos siguiendo el formato de Conventional Commits:
     ```
     tipo(alcance): descripción
     
     cuerpo (opcional)
     
     pie de página (opcional)
     ```
   - Tipos comunes: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
   - Ejemplo:
     ```
     feat(activities): añadir filtro por dependencia
     
     Añade la capacidad de filtrar actividades por dependencia en la API y en la interfaz de usuario.
     
     Closes #123
     ```

4. **Enviar Cambios**:
   ```bash
   git push origin feature/mi-nueva-caracteristica
   ```

5. **Crear un Pull Request**:
   - Crea un PR desde tu rama a `develop`
   - Describe los cambios realizados
   - Referencia cualquier issue relacionado
   - Asigna revisores

6. **Revisión de Código**:
   - Responde a los comentarios de los revisores
   - Realiza los cambios solicitados
   - Asegúrate de que todas las pruebas pasen

7. **Merge**:
   - Una vez aprobado, el PR será fusionado a `develop`
   - Los cambios se desplegarán automáticamente en el entorno de desarrollo

## Estándares de Código

### Backend (Java)

1. **Estilo de Código**:
   - Seguimos las [Convenciones de Código de Google para Java](https://google.github.io/styleguide/javaguide.html)
   - Indentación: 4 espacios
   - Longitud máxima de línea: 120 caracteres
   - Usar camelCase para variables y métodos
   - Usar PascalCase para clases e interfaces
   - Usar UPPER_SNAKE_CASE para constantes

2. **Arquitectura**:
   - Seguimos la Arquitectura Hexagonal (Puertos y Adaptadores)
   - Separar claramente las capas de dominio, aplicación e infraestructura
   - Usar interfaces para definir puertos
   - Implementar adaptadores para interactuar con el exterior

3. **Pruebas**:
   - Escribir pruebas unitarias para la lógica de negocio
   - Escribir pruebas de integración para los adaptadores
   - Usar mocks para simular dependencias externas
   - Mantener una cobertura de código de al menos 80%

4. **Documentación**:
   - Documentar todas las clases y métodos públicos con Javadoc
   - Documentar los endpoints de la API con OpenAPI
   - Mantener actualizada la documentación de arquitectura

### Frontend (TypeScript/React)

1. **Estilo de Código**:
   - Seguimos las [Convenciones de Código de Airbnb para JavaScript](https://github.com/airbnb/javascript)
   - Indentación: 2 espacios
   - Longitud máxima de línea: 100 caracteres
   - Usar camelCase para variables y funciones
   - Usar PascalCase para componentes y tipos
   - Usar destructuring para props

2. **Arquitectura**:
   - Organizar el código por características (feature-based)
   - Separar componentes de presentación y contenedores
   - Usar hooks para lógica reutilizable
   - Mantener el estado global en Redux
   - Usar React Query para datos remotos

3. **Pruebas**:
   - Escribir pruebas unitarias para componentes
   - Escribir pruebas de integración para flujos completos
   - Usar React Testing Library para pruebas de componentes
   - Mantener una cobertura de código de al menos 80%

4. **Documentación**:
   - Documentar componentes con JSDoc
   - Mantener actualizada la documentación de arquitectura
   - Documentar hooks personalizados

## Revisión de Código

Todos los cambios deben pasar por un proceso de revisión de código antes de ser fusionados. Los revisores deben verificar:

1. **Funcionalidad**:
   - ¿El código hace lo que se supone que debe hacer?
   - ¿Se han considerado casos extremos?

2. **Calidad**:
   - ¿El código sigue los estándares del proyecto?
   - ¿Hay pruebas adecuadas?
   - ¿El código es mantenible?

3. **Seguridad**:
   - ¿Hay vulnerabilidades potenciales?
   - ¿Se validan adecuadamente las entradas?
   - ¿Se manejan correctamente los errores?

4. **Rendimiento**:
   - ¿El código es eficiente?
   - ¿Se han considerado problemas de escalabilidad?

## Informar Problemas

Si encuentras un error o tienes una sugerencia, por favor crea un issue en el repositorio:

1. Usa una plantilla de issue si está disponible
2. Proporciona pasos detallados para reproducir el problema
3. Incluye capturas de pantalla si es relevante
4. Especifica la versión del software y el entorno

## Solicitar Características

Si deseas solicitar una nueva característica:

1. Verifica que no exista ya un issue similar
2. Describe claramente la característica y su propósito
3. Explica cómo beneficiaría al proyecto
4. Proporciona ejemplos de uso si es posible

## Proceso de Lanzamiento

Seguimos un proceso de lanzamiento basado en Semantic Versioning:

1. **Versiones Menores**: Nuevas características compatibles con versiones anteriores
2. **Versiones de Parche**: Correcciones de errores compatibles con versiones anteriores
3. **Versiones Mayores**: Cambios incompatibles con versiones anteriores

El proceso de lanzamiento incluye:

1. Crear una rama `release/vX.Y.Z` desde `develop`
2. Realizar pruebas finales y correcciones
3. Fusionar a `main` y etiquetar con la versión
4. Fusionar de vuelta a `develop`

## Recursos Adicionales

- [Documentación de Arquitectura](./architecture/overview.md)
- [Referencia de la API](./api-reference.md)
- [Guía de Estilo de Código](./code-style.md)
- [Guía de Pruebas](./testing.md)

## Código de Conducta

Nos adherimos al [Código de Conducta del Contribuyente](https://www.contributor-covenant.org/version/2/0/code_of_conduct/). Al participar en este proyecto, te comprometes a mantener este código. Por favor, reporta comportamientos inaceptables a [conducta@mpd.gov.ar](mailto:conducta@mpd.gov.ar).
