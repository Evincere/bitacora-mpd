# Scripts de Mantenimiento - Bitácora MPD

Este directorio contiene scripts para facilitar el mantenimiento y la calidad del proyecto Bitácora MPD.

## Scripts Disponibles

### verify-configs.sh

**Propósito**: Verificar la validez de los archivos de configuración XML.

**Uso**:
```bash
./scripts/verify-configs.sh
```

**Funcionalidades**:
- Verifica la sintaxis XML de los archivos de configuración
- Detecta propiedades obsoletas en la configuración de Checkstyle
- Verifica la versión del esquema en la configuración de PMD
- Verifica el namespace en la configuración de SpotBugs
- Verifica etiquetas básicas en la configuración de Maven

**Salida**:
- Mensajes en consola indicando el resultado de cada verificación
- Logs detallados en el directorio `logs/`

### setup-hooks.sh

**Propósito**: Configurar hooks de git para verificar configuraciones antes de commit.

**Uso**:
```bash
./scripts/setup-hooks.sh
```

**Funcionalidades**:
- Configura un hook de pre-commit que ejecuta `verify-configs.sh` antes de cada commit
- Configura un hook de post-merge que advierte cuando se actualizan archivos de configuración

**Nota**: Este script solo necesita ejecutarse una vez para configurar los hooks.

### check-dependencies.sh

**Propósito**: Verificar y actualizar dependencias del proyecto.

**Uso**:
```bash
./scripts/check-dependencies.sh
```

**Funcionalidades**:
- Verifica dependencias desactualizadas de Maven y npm
- Verifica vulnerabilidades en dependencias
- Genera un informe resumido en Markdown
- Ofrece la opción de actualizar automáticamente las dependencias

**Salida**:
- Mensajes en consola indicando el progreso
- Logs detallados en el directorio `logs/`
- Informe resumido en `logs/dependencies-report.md`

## Recomendaciones de Uso

1. **Verificación regular**: Ejecutar `check-dependencies.sh` mensualmente para mantener las dependencias actualizadas.
2. **Antes de commits importantes**: Ejecutar `verify-configs.sh` antes de hacer commit de cambios en archivos de configuración.
3. **Configuración inicial**: Ejecutar `setup-hooks.sh` al clonar el repositorio por primera vez.
4. **Automatización**: Considerar la integración de estos scripts en el pipeline de CI/CD.

## Mantenimiento de los Scripts

Estos scripts están diseñados para ser mantenibles y extensibles:

- Cada script tiene una función específica y bien definida
- Los scripts están documentados con comentarios explicativos
- La salida es clara y proporciona información útil
- Los logs se almacenan en un directorio separado para facilitar su revisión

## Solución de Problemas

### verify-configs.sh falla

- Verificar que xmllint esté instalado
- Revisar los logs en el directorio `logs/` para obtener detalles específicos
- Corregir los problemas identificados en los archivos de configuración

### setup-hooks.sh no funciona

- Verificar que el directorio `.git/hooks` exista
- Asegurarse de tener permisos de escritura en el directorio `.git/hooks`
- Verificar que los scripts tengan permisos de ejecución

### check-dependencies.sh muestra muchas vulnerabilidades

- Priorizar la actualización de dependencias con vulnerabilidades críticas
- Considerar alternativas para dependencias con vulnerabilidades no parcheadas
- Documentar las vulnerabilidades conocidas y las razones para no actualizarlas
