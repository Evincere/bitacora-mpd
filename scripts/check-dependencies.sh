#!/bin/bash

# Script para verificar y actualizar dependencias
# Ejecutar este script periódicamente para mantener las dependencias actualizadas

echo "Verificando dependencias..."
echo "=========================="

# Crear directorio para logs
mkdir -p logs

# Verificar dependencias de Maven
echo "Verificando dependencias de Maven..."
cd backend
./mvnw versions:display-dependency-updates > ../logs/maven-dependencies.log
./mvnw versions:display-plugin-updates >> ../logs/maven-dependencies.log
cd ..

echo "Informe de dependencias de Maven guardado en logs/maven-dependencies.log"

# Verificar dependencias de npm
echo "Verificando dependencias de npm..."
cd frontend
npm outdated > ../logs/npm-dependencies.log
cd ..

echo "Informe de dependencias de npm guardado en logs/npm-dependencies.log"

# Verificar vulnerabilidades en dependencias de Maven
echo "Verificando vulnerabilidades en dependencias de Maven..."
cd backend
./mvnw org.owasp:dependency-check-maven:check -DskipProvidedScope=true -DskipTestScope=true > ../logs/maven-vulnerabilities.log
cd ..

echo "Informe de vulnerabilidades de Maven guardado en logs/maven-vulnerabilities.log"

# Verificar vulnerabilidades en dependencias de npm
echo "Verificando vulnerabilidades en dependencias de npm..."
cd frontend
npm audit > ../logs/npm-vulnerabilities.log
cd ..

echo "Informe de vulnerabilidades de npm guardado en logs/npm-vulnerabilities.log"

# Generar informe resumido
echo "Generando informe resumido..."

echo "# Informe de Dependencias - Bitácora MPD" > logs/dependencies-report.md
echo "" >> logs/dependencies-report.md
echo "Fecha: $(date '+%Y-%m-%d %H:%M:%S')" >> logs/dependencies-report.md
echo "" >> logs/dependencies-report.md

echo "## Dependencias de Maven desactualizadas" >> logs/dependencies-report.md
echo "" >> logs/dependencies-report.md
echo '```' >> logs/dependencies-report.md
grep -A 2 "The following dependencies" logs/maven-dependencies.log >> logs/dependencies-report.md
echo '```' >> logs/dependencies-report.md
echo "" >> logs/dependencies-report.md

echo "## Plugins de Maven desactualizados" >> logs/dependencies-report.md
echo "" >> logs/dependencies-report.md
echo '```' >> logs/dependencies-report.md
grep -A 2 "The following plugins" logs/maven-dependencies.log >> logs/dependencies-report.md
echo '```' >> logs/dependencies-report.md
echo "" >> logs/dependencies-report.md

echo "## Dependencias de npm desactualizadas" >> logs/dependencies-report.md
echo "" >> logs/dependencies-report.md
echo '```' >> logs/dependencies-report.md
cat logs/npm-dependencies.log >> logs/dependencies-report.md
echo '```' >> logs/dependencies-report.md
echo "" >> logs/dependencies-report.md

echo "## Vulnerabilidades en dependencias de Maven" >> logs/dependencies-report.md
echo "" >> logs/dependencies-report.md
echo '```' >> logs/dependencies-report.md
grep -A 5 "One or more dependencies" logs/maven-vulnerabilities.log >> logs/dependencies-report.md
echo '```' >> logs/dependencies-report.md
echo "" >> logs/dependencies-report.md

echo "## Vulnerabilidades en dependencias de npm" >> logs/dependencies-report.md
echo "" >> logs/dependencies-report.md
echo '```' >> logs/dependencies-report.md
grep -A 10 "found [0-9]* vulnerabilities" logs/npm-vulnerabilities.log >> logs/dependencies-report.md
echo '```' >> logs/dependencies-report.md
echo "" >> logs/dependencies-report.md

echo "## Recomendaciones" >> logs/dependencies-report.md
echo "" >> logs/dependencies-report.md
echo "1. Revisar las dependencias desactualizadas y actualizar a las versiones más recientes cuando sea posible." >> logs/dependencies-report.md
echo "2. Priorizar la actualización de dependencias con vulnerabilidades de seguridad." >> logs/dependencies-report.md
echo "3. Probar exhaustivamente después de actualizar dependencias críticas." >> logs/dependencies-report.md
echo "4. Documentar cualquier decisión de no actualizar una dependencia específica." >> logs/dependencies-report.md
echo "" >> logs/dependencies-report.md

echo "Informe resumido guardado en logs/dependencies-report.md"

# Preguntar si se desea actualizar automáticamente las dependencias
echo ""
echo "¿Desea actualizar automáticamente las dependencias? (s/n)"
read -r response

if [[ "$response" =~ ^([sS])$ ]]; then
    echo "Actualizando dependencias de Maven..."
    cd backend
    ./mvnw versions:use-latest-releases -DallowSnapshots=false -DallowMajorUpdates=false
    cd ..
    
    echo "Actualizando dependencias de npm..."
    cd frontend
    npm update
    cd ..
    
    echo "Dependencias actualizadas. Se recomienda revisar los cambios y ejecutar las pruebas."
else
    echo "No se actualizaron las dependencias automáticamente."
    echo "Puede actualizar manualmente siguiendo las recomendaciones del informe."
fi

echo ""
echo "Verificación de dependencias completada"
