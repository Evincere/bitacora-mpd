# Compatibilidad de Bases de Datos

Este documento explica las diferencias de sintaxis entre H2 (usado en desarrollo) y PostgreSQL (usado en producción) y cómo manejarlas en las migraciones de Flyway.

## Diferencias de Sintaxis

### Intervalos de Tiempo

#### PostgreSQL
PostgreSQL utiliza la sintaxis `INTERVAL` para manipular fechas y horas:

```sql
-- Restar 2 días a la fecha actual
CURRENT_TIMESTAMP - INTERVAL '2 days'

-- Sumar 1 día a la fecha actual
CURRENT_TIMESTAMP + INTERVAL '1 day'

-- Otros ejemplos
CURRENT_TIMESTAMP + INTERVAL '3 hours'
CURRENT_TIMESTAMP - INTERVAL '1 month 2 days'
```

#### H2
H2 utiliza funciones como `DATEADD` para manipular fechas y horas:

```sql
-- Restar 2 días a la fecha actual
DATEADD('DAY', -2, CURRENT_TIMESTAMP)

-- Sumar 1 día a la fecha actual
DATEADD('DAY', 1, CURRENT_TIMESTAMP)

-- Otros ejemplos
DATEADD('HOUR', 3, CURRENT_TIMESTAMP)
DATEADD('DAY', -2, DATEADD('MONTH', -1, CURRENT_TIMESTAMP))
```

### Funciones de Texto

#### PostgreSQL
```sql
-- Concatenar texto
'texto1' || 'texto2'

-- Convertir a minúsculas
LOWER('TEXTO')

-- Extraer subcadena
SUBSTRING('texto' FROM 2 FOR 3)
```

#### H2
```sql
-- Concatenar texto
CONCAT('texto1', 'texto2')

-- Convertir a minúsculas
LOWER('TEXTO')

-- Extraer subcadena
SUBSTRING('texto', 2, 3)
```

### Funciones de Agregación

#### PostgreSQL
```sql
-- Agrupar filas y concatenar valores
STRING_AGG(column_name, ',')
```

#### H2
```sql
-- Agrupar filas y concatenar valores
LISTAGG(column_name, ',') WITHIN GROUP (ORDER BY column_name)
```

## Estrategias para Mantener la Compatibilidad

### 1. Usar Funciones Compatibles con Ambas Bases de Datos

Siempre que sea posible, utiliza funciones que sean compatibles con ambas bases de datos:

```sql
-- Funciones de fecha compatibles
CURRENT_TIMESTAMP
CURRENT_DATE
EXTRACT(YEAR FROM date_column)
```

### 2. Usar Comentarios para Documentar Alternativas

```sql
-- PostgreSQL: CURRENT_TIMESTAMP - INTERVAL '2 days'
-- H2: DATEADD('DAY', -2, CURRENT_TIMESTAMP)
DATEADD('DAY', -2, CURRENT_TIMESTAMP)
```

### 3. Usar Perfiles Específicos para Cada Base de Datos

En casos complejos, puedes crear migraciones específicas para cada base de datos:

```
V1__Create_Schema.sql          # Común para ambas bases de datos
V2__H2_Specific.sql            # Solo se ejecuta en H2
V2__PostgreSQL_Specific.sql    # Solo se ejecuta en PostgreSQL
```

Y configurar Flyway para usar el perfil correcto:

```yaml
spring:
  profiles:
    active: h2 # o postgresql
  flyway:
    locations: classpath:db/migration,classpath:db/migration/{spring.profiles.active}
```

## Referencias

- [Documentación de H2 - Funciones de Fecha y Hora](http://www.h2database.com/html/functions.html#dateadd)
- [Documentación de PostgreSQL - Tipos de Datos de Fecha/Hora](https://www.postgresql.org/docs/current/datatype-datetime.html)
- [Documentación de PostgreSQL - Funciones y Operadores de Fecha/Hora](https://www.postgresql.org/docs/current/functions-datetime.html)
