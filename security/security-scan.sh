#!/bin/bash

echo "==================================================="
echo "Bitacora MPD - Analisis de Seguridad"
echo "==================================================="

# Crear directorio para resultados
mkdir -p results

# Obtener fecha y hora actual para el nombre del archivo
timestamp=$(date +"%Y%m%d_%H%M%S")
result_dir="results/security_scan_${timestamp}"
mkdir -p "${result_dir}"

echo "Ejecutando analisis de seguridad..."
echo "Directorio de resultados: ${result_dir}"

echo ""
echo "1. Analisis de dependencias (OWASP Dependency Check)"
echo "---------------------------------------------------"
cd ../backend
./mvnw org.owasp:dependency-check-maven:check -DoutputDirectory=../security/${result_dir}/dependency-check -DformatsEnabled=HTML,JSON,CSV
cd ../security

echo ""
echo "2. Analisis de codigo estatico (PMD)"
echo "---------------------------------------------------"
cd ../backend
./mvnw pmd:pmd -DoutputDirectory=../security/${result_dir}/pmd
cd ../security

echo ""
echo "3. Analisis de codigo estatico (SpotBugs)"
echo "---------------------------------------------------"
cd ../backend
./mvnw com.github.spotbugs:spotbugs-maven-plugin:spotbugs -DoutputDirectory=../security/${result_dir}/spotbugs
cd ../security

echo ""
echo "4. Analisis de dependencias de frontend (npm audit)"
echo "---------------------------------------------------"
cd ../frontend
npm audit --json > ../security/${result_dir}/npm-audit.json
cd ../security

echo ""
echo "5. Verificacion de configuracion de seguridad"
echo "---------------------------------------------------"
echo "Verificando configuracion de seguridad..."

# Verificar configuracion de seguridad en application.yml
grep -i "security\|jwt\|cors\|csrf" ../backend/src/main/resources/application.yml > "${result_dir}/security-config.txt"

echo ""
echo "6. Generando informe de seguridad"
echo "---------------------------------------------------"
echo "Generando informe de seguridad..."

cat > "${result_dir}/security-report.md" << EOF
# Informe de Analisis de Seguridad - Bitacora MPD

Fecha: $(date +"%Y-%m-%d %H:%M:%S")

## Resumen

Este informe contiene los resultados del analisis de seguridad automatizado para el proyecto Bitacora MPD.

## Analisis de Dependencias (Backend)

Ver informe detallado en [dependency-check/dependency-check-report.html](dependency-check/dependency-check-report.html)

## Analisis de Codigo Estatico (PMD)

Ver informe detallado en [pmd/pmd-report.html](pmd/pmd-report.html)

## Analisis de Codigo Estatico (SpotBugs)

Ver informe detallado en [spotbugs/spotbugs.html](spotbugs/spotbugs.html)

## Analisis de Dependencias (Frontend)

Ver informe detallado en [npm-audit.json](npm-audit.json)

## Configuracion de Seguridad

\`\`\`
$(cat "${result_dir}/security-config.txt")
\`\`\`

## Recomendaciones

1. Revisar y actualizar las dependencias vulnerables identificadas en los informes
2. Corregir los problemas de codigo identificados por PMD y SpotBugs
3. Verificar la configuracion de seguridad y asegurarse de que sigue las mejores practicas
4. Realizar pruebas de penetracion manuales para identificar vulnerabilidades no detectadas por herramientas automatizadas
EOF

echo ""
echo "Analisis de seguridad completado."
echo "Informe generado en: ${result_dir}/security-report.md"
echo ""

exit 0
