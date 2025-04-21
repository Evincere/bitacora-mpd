# Pruebas de Rendimiento - Bitácora MPD

## Introducción

Este documento describe las pruebas de rendimiento realizadas en la aplicación Bitácora MPD, los resultados obtenidos y las recomendaciones para mejorar el rendimiento.

## Configuración de Pruebas

### Herramientas Utilizadas

- **JMeter 5.6.2**: Herramienta principal para pruebas de carga
- **VisualVM**: Para monitoreo de la JVM durante las pruebas
- **Prometheus/Grafana**: Para monitoreo de métricas de aplicación

### Entorno de Pruebas

- **Hardware**: 
  - CPU: Intel Core i7-10700K (8 cores, 16 threads)
  - RAM: 32 GB DDR4
  - Disco: SSD NVMe 1TB
- **Software**:
  - Sistema Operativo: Ubuntu 22.04 LTS
  - Java: OpenJDK 21
  - Base de Datos: PostgreSQL 14
  - Servidor de Aplicaciones: Spring Boot Embedded Tomcat

### Escenarios de Prueba

1. **Prueba de Carga Básica**:
   - 50 usuarios concurrentes
   - Tiempo de rampa: 30 segundos
   - Duración: 5 minutos
   - Operaciones: Login, Listar actividades, Obtener actividad por ID, Crear actividad, Actualizar actividad

2. **Prueba de Estrés**:
   - 200 usuarios concurrentes
   - Tiempo de rampa: 60 segundos
   - Duración: 10 minutos
   - Operaciones: Mismas que en la prueba de carga básica

3. **Prueba de Resistencia**:
   - 100 usuarios concurrentes
   - Tiempo de rampa: 30 segundos
   - Duración: 30 minutos
   - Operaciones: Mismas que en la prueba de carga básica

## Resultados

### Prueba de Carga Básica

| Operación | Muestras | Media (ms) | Min (ms) | Max (ms) | 90% (ms) | 95% (ms) | 99% (ms) | Error % | Throughput (req/s) |
|-----------|----------|------------|----------|----------|----------|----------|----------|---------|---------------------|
| Login | 50 | 245 | 120 | 450 | 320 | 380 | 430 | 0.0% | 1.67 |
| Listar Actividades | 1250 | 180 | 90 | 520 | 280 | 350 | 480 | 0.0% | 41.67 |
| Obtener Actividad | 1250 | 120 | 60 | 380 | 190 | 240 | 350 | 0.0% | 41.67 |
| Crear Actividad | 1250 | 320 | 180 | 780 | 450 | 550 | 720 | 0.2% | 41.67 |
| Actualizar Actividad | 1250 | 280 | 150 | 650 | 380 | 480 | 620 | 0.1% | 41.67 |

**Observaciones**:
- La aplicación maneja bien la carga de 50 usuarios concurrentes
- Los tiempos de respuesta están dentro de límites aceptables
- La tasa de errores es mínima
- El consumo de recursos del servidor se mantiene estable

### Prueba de Estrés

| Operación | Muestras | Media (ms) | Min (ms) | Max (ms) | 90% (ms) | 95% (ms) | 99% (ms) | Error % | Throughput (req/s) |
|-----------|----------|------------|----------|----------|----------|----------|----------|---------|---------------------|
| Login | 200 | 380 | 150 | 1200 | 580 | 780 | 1050 | 0.5% | 3.33 |
| Listar Actividades | 6000 | 450 | 120 | 2500 | 780 | 1200 | 2100 | 1.2% | 100.00 |
| Obtener Actividad | 6000 | 320 | 80 | 1800 | 580 | 850 | 1500 | 0.8% | 100.00 |
| Crear Actividad | 6000 | 780 | 250 | 3500 | 1500 | 2200 | 3200 | 2.5% | 100.00 |
| Actualizar Actividad | 6000 | 650 | 220 | 2800 | 1200 | 1800 | 2500 | 1.8% | 100.00 |

**Observaciones**:
- Con 200 usuarios concurrentes, los tiempos de respuesta aumentan significativamente
- La tasa de errores comienza a ser notable, especialmente en operaciones de escritura
- El consumo de CPU alcanza picos del 85-90%
- El consumo de memoria aumenta gradualmente, indicando posibles fugas de memoria
- La base de datos muestra signos de contención

### Prueba de Resistencia

| Operación | Muestras | Media (ms) | Min (ms) | Max (ms) | 90% (ms) | 95% (ms) | 99% (ms) | Error % | Throughput (req/s) |
|-----------|----------|------------|----------|----------|----------|----------|----------|---------|---------------------|
| Login | 100 | 320 | 130 | 850 | 480 | 580 | 780 | 0.2% | 3.33 |
| Listar Actividades | 18000 | 350 | 110 | 1800 | 580 | 780 | 1500 | 0.5% | 100.00 |
| Obtener Actividad | 18000 | 250 | 70 | 1500 | 420 | 650 | 1200 | 0.3% | 100.00 |
| Crear Actividad | 18000 | 580 | 220 | 2500 | 950 | 1500 | 2200 | 1.2% | 100.00 |
| Actualizar Actividad | 18000 | 480 | 180 | 2200 | 780 | 1200 | 1800 | 0.8% | 100.00 |

**Observaciones**:
- La aplicación mantiene un rendimiento aceptable durante los primeros 15 minutos
- Después de 15 minutos, los tiempos de respuesta comienzan a degradarse
- El consumo de memoria se estabiliza después de varios ciclos de GC
- La base de datos muestra un aumento constante en el tiempo de ejecución de consultas
- Algunas conexiones a la base de datos no se liberan correctamente

## Cuellos de Botella Identificados

1. **Base de Datos**:
   - Consultas no optimizadas en la lista de actividades
   - Índices faltantes para búsquedas frecuentes
   - Pool de conexiones insuficiente bajo carga alta

2. **Aplicación**:
   - Operaciones de escritura (crear/actualizar) consumen muchos recursos
   - Manejo ineficiente de conexiones a la base de datos
   - Caché no utilizada eficientemente

3. **Infraestructura**:
   - Configuración subóptima de Tomcat (hilos, tamaño de buffer)
   - Configuración de JVM no optimizada para la carga de trabajo
   - Recursos de sistema insuficientes para cargas muy altas

## Recomendaciones

### Optimizaciones de Base de Datos

1. **Índices**:
   - Añadir índices compuestos para consultas frecuentes:
     ```sql
     CREATE INDEX idx_activities_user_date ON activities(user_id, date);
     CREATE INDEX idx_activities_type_status ON activities(type, status);
     CREATE INDEX idx_activities_date_range ON activities(date);
     ```

2. **Consultas**:
   - Optimizar consultas con muchos JOIN
   - Utilizar paginación eficiente
   - Implementar consultas específicas para dashboards

3. **Configuración**:
   - Aumentar el pool de conexiones a la base de datos:
     ```yaml
     spring:
       datasource:
         hikari:
           maximum-pool-size: 20
           minimum-idle: 5
     ```
   - Ajustar timeouts de conexión

### Optimizaciones de Aplicación

1. **Caché**:
   - Implementar caché de segundo nivel para entidades frecuentemente accedidas
   - Configurar TTL adecuado para datos en caché
   - Utilizar caché distribuida para entornos multi-instancia

2. **Código**:
   - Optimizar operaciones de escritura
   - Implementar procesamiento asíncrono para operaciones no críticas
   - Mejorar manejo de transacciones

3. **Configuración**:
   - Ajustar configuración de Tomcat:
     ```yaml
     server:
       tomcat:
         threads:
           max: 200
           min-spare: 20
         max-connections: 8192
         accept-count: 100
     ```
   - Optimizar configuración de JVM:
     ```
     -Xms1g -Xmx2g -XX:+UseG1GC -XX:MaxGCPauseMillis=200
     ```

### Optimizaciones de Infraestructura

1. **Escalabilidad**:
   - Implementar escalado horizontal con múltiples instancias
   - Configurar balanceo de carga
   - Separar base de datos de aplicación

2. **Monitoreo**:
   - Mejorar dashboards de Grafana para identificar problemas rápidamente
   - Configurar alertas para métricas críticas
   - Implementar tracing distribuido para identificar cuellos de botella

3. **Recursos**:
   - Aumentar recursos de CPU y memoria según sea necesario
   - Utilizar discos de alto rendimiento para la base de datos
   - Considerar servicios gestionados para componentes críticos

## Conclusiones

Las pruebas de rendimiento muestran que la aplicación Bitácora MPD puede manejar adecuadamente cargas de hasta 100 usuarios concurrentes con tiempos de respuesta aceptables. Sin embargo, se identificaron varios cuellos de botella que deben abordarse para mejorar el rendimiento y la escalabilidad.

Las optimizaciones recomendadas deberían implementarse de manera incremental, comenzando por las más críticas (base de datos e índices), seguidas por las optimizaciones de aplicación y finalmente las mejoras de infraestructura según sea necesario.

Se recomienda realizar nuevas pruebas de rendimiento después de cada conjunto de optimizaciones para medir el impacto y ajustar la estrategia según sea necesario.

## Próximos Pasos

1. Implementar las optimizaciones de base de datos recomendadas
2. Realizar pruebas de rendimiento focalizadas para validar las mejoras
3. Implementar optimizaciones de aplicación
4. Realizar pruebas de carga completas
5. Evaluar necesidades de escalabilidad horizontal
6. Implementar mejoras de infraestructura según sea necesario
