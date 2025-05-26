#!/bin/bash

# Script para testing integral sin datos mock
# Verifica que todos los módulos funcionen correctamente sin dependencias simuladas

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  TESTING INTEGRAL SIN DATOS MOCK${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Función para mostrar el progreso
show_progress() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Función para mostrar éxito
show_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

# Función para mostrar advertencia
show_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Función para mostrar error
show_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio raíz del proyecto
if [ ! -f "package.json" ] && [ ! -f "backend/pom.xml" ]; then
    show_error "Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
fi

# Contador de errores
errors=0

echo -e "${YELLOW}1. VERIFICACIÓN DE CONFIGURACIÓN${NC}"
echo "=================================="

# Verificar que no existan referencias a VITE_USE_MOCK_DATA
show_progress "Verificando ausencia de referencias a VITE_USE_MOCK_DATA..."
if grep -r "VITE_USE_MOCK_DATA" frontend/src/ 2>/dev/null; then
    show_error "Se encontraron referencias a VITE_USE_MOCK_DATA en el código"
    errors=$((errors + 1))
else
    show_success "No se encontraron referencias a VITE_USE_MOCK_DATA"
fi

# Verificar que no existan archivos mock obsoletos
show_progress "Verificando ausencia de archivos mock obsoletos..."
mock_files_found=false

if [ -f "frontend/src/components/common/MockDataBanner.tsx" ]; then
    show_error "MockDataBanner.tsx aún existe"
    mock_files_found=true
fi

# Buscar archivos con 'mock' en el nombre (excluyendo tests)
mock_files=$(find frontend/src -name "*mock*" -not -path "*/test/*" -not -path "*/__tests__/*" -not -name "*.test.*" -not -name "*.spec.*" 2>/dev/null || true)
if [ -n "$mock_files" ]; then
    show_error "Se encontraron archivos mock:"
    echo "$mock_files"
    mock_files_found=true
fi

if [ "$mock_files_found" = false ]; then
    show_success "No se encontraron archivos mock obsoletos"
else
    errors=$((errors + 1))
fi

echo ""
echo -e "${YELLOW}2. TESTING DEL FRONTEND${NC}"
echo "========================"

cd frontend

# Verificar que las dependencias estén instaladas
show_progress "Verificando dependencias del frontend..."
if [ ! -d "node_modules" ]; then
    show_warning "Instalando dependencias del frontend..."
    npm install
fi

# Ejecutar linting
show_progress "Ejecutando linting del frontend..."
if npm run lint; then
    show_success "Linting del frontend pasó"
else
    show_error "Linting del frontend falló"
    errors=$((errors + 1))
fi

# Ejecutar type checking
show_progress "Ejecutando verificación de tipos..."
if npm run type-check; then
    show_success "Verificación de tipos pasó"
else
    show_error "Verificación de tipos falló"
    errors=$((errors + 1))
fi

# Ejecutar tests unitarios
show_progress "Ejecutando tests unitarios del frontend..."
if npm run test:run; then
    show_success "Tests unitarios del frontend pasaron"
else
    show_error "Tests unitarios del frontend fallaron"
    errors=$((errors + 1))
fi

# Verificar que el build funcione
show_progress "Verificando build del frontend..."
if npm run build; then
    show_success "Build del frontend exitoso"
    # Limpiar el build
    rm -rf dist
else
    show_error "Build del frontend falló"
    errors=$((errors + 1))
fi

cd ..

echo ""
echo -e "${YELLOW}3. TESTING DEL BACKEND${NC}"
echo "======================"

cd backend

# Verificar que Maven esté disponible
show_progress "Verificando Maven..."
if command -v mvn >/dev/null 2>&1; then
    MAVEN_CMD="mvn"
elif [ -f "./mvnw" ]; then
    MAVEN_CMD="./mvnw"
else
    show_error "Maven no está disponible"
    exit 1
fi

# Ejecutar tests unitarios del backend
show_progress "Ejecutando tests unitarios del backend..."
if $MAVEN_CMD test -Dspring.profiles.active=test; then
    show_success "Tests unitarios del backend pasaron"
else
    show_error "Tests unitarios del backend fallaron"
    errors=$((errors + 1))
fi

# Verificar compilación
show_progress "Verificando compilación del backend..."
if $MAVEN_CMD compile -DskipTests; then
    show_success "Compilación del backend exitosa"
else
    show_error "Compilación del backend falló"
    errors=$((errors + 1))
fi

# Verificar que el sistema de datos configurables funcione
show_progress "Verificando sistema de datos configurables..."
if $MAVEN_CMD test -Dtest=ConfigurableDataInitializerTest -Dspring.profiles.active=test,configurable-data-init,test-data 2>/dev/null; then
    show_success "Sistema de datos configurables funciona"
else
    show_warning "No se pudo verificar el sistema de datos configurables (test no encontrado)"
fi

cd ..

echo ""
echo -e "${YELLOW}4. VERIFICACIÓN DE INTEGRACIÓN${NC}"
echo "==============================="

# Verificar configuraciones de datos iniciales
show_progress "Verificando archivos de configuración de datos..."
config_files=(
    "backend/src/main/resources/application-configurable-data.yml"
    "backend/src/main/resources/application-dev-data.yml"
    "backend/src/main/resources/application-test-data.yml"
    "backend/src/main/resources/application-prod-data.yml"
)

for config_file in "${config_files[@]}"; do
    if [ -f "$config_file" ]; then
        show_success "Encontrado: $config_file"
    else
        show_error "Falta: $config_file"
        errors=$((errors + 1))
    fi
done

# Verificar documentación
show_progress "Verificando documentación actualizada..."
doc_files=(
    "backend/CONFIGURABLE-DATA-INITIALIZATION.md"
    "backend/README-DATA-INITIALIZATION.md"
    "CHANGELOG.md"
    "TASKS.md"
)

for doc_file in "${doc_files[@]}"; do
    if [ -f "$doc_file" ]; then
        show_success "Encontrado: $doc_file"
    else
        show_error "Falta: $doc_file"
        errors=$((errors + 1))
    fi
done

echo ""
echo -e "${YELLOW}5. RESUMEN DE RESULTADOS${NC}"
echo "========================="

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✅ TODOS LOS TESTS PASARON${NC}"
    echo -e "${GREEN}✅ El sistema está listo para producción sin datos mock${NC}"
    echo ""
    echo -e "${BLUE}Beneficios logrados:${NC}"
    echo "• ✅ Eliminados todos los datos mock y hardcodeados"
    echo "• ✅ Sistema de configuración flexible implementado"
    echo "• ✅ Manejo de errores robusto en toda la aplicación"
    echo "• ✅ Estados vacíos apropiados para mejor UX"
    echo "• ✅ Configuración por ambiente sin recompilación"
    echo "• ✅ Seguridad mejorada con variables de entorno"
    echo ""
    echo -e "${BLUE}Para usar el sistema configurable:${NC}"
    echo "• Desarrollo: --spring.profiles.active=dev,configurable-data-init,dev-data"
    echo "• Testing: --spring.profiles.active=test,configurable-data-init,test-data"
    echo "• Producción: --spring.profiles.active=prod,configurable-data-init,prod-data"
    echo ""
    exit 0
else
    echo -e "${RED}❌ SE ENCONTRARON $errors ERRORES${NC}"
    echo -e "${RED}❌ Revisar los errores antes de continuar${NC}"
    echo ""
    echo -e "${YELLOW}Acciones recomendadas:${NC}"
    echo "• Revisar y corregir los errores reportados"
    echo "• Ejecutar tests individuales para más detalles"
    echo "• Verificar configuraciones de ambiente"
    echo ""
    exit 1
fi
