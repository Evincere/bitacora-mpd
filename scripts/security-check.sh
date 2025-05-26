#!/bin/bash

# Script de verificación de seguridad para producción
# Verifica que no haya configuraciones inseguras antes del despliegue

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  VERIFICACIÓN DE SEGURIDAD${NC}"
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

# Contador de errores
errors=0
warnings=0

echo -e "${YELLOW}1. VERIFICACIÓN DE SECRETS HARDCODEADOS${NC}"
echo "========================================="

# Verificar JWT secrets hardcodeados
show_progress "Verificando JWT secrets hardcodeados..."
if grep -r "bitacoraSecretKey" backend/src/ 2>/dev/null; then
    show_error "Se encontraron JWT secrets hardcodeados"
    errors=$((errors + 1))
else
    show_success "No se encontraron JWT secrets hardcodeados"
fi

# Verificar URLs de desarrollo
show_progress "Verificando URLs de desarrollo..."
if grep -r "metres-dispatch-takes-reserve" backend/src/ 2>/dev/null; then
    show_error "Se encontraron URLs de desarrollo hardcodeadas"
    errors=$((errors + 1))
else
    show_success "No se encontraron URLs de desarrollo"
fi

# Verificar contraseñas por defecto
show_progress "Verificando contraseñas por defecto..."
if grep -r "Admin@123\|test123\|Usuario@123" backend/src/main/resources/application*.yml 2>/dev/null | grep -v "test-data.yml"; then
    show_warning "Se encontraron contraseñas por defecto en configuraciones de producción"
    warnings=$((warnings + 1))
else
    show_success "No se encontraron contraseñas por defecto problemáticas"
fi

echo ""
echo -e "${YELLOW}2. VERIFICACIÓN DE CONFIGURACIONES${NC}"
echo "==================================="

# Verificar configuración de CORS
show_progress "Verificando configuración de CORS..."
if grep -r "allowed-origins.*localhost.*cloudflare" backend/src/ 2>/dev/null; then
    show_error "CORS permite URLs de desarrollo"
    errors=$((errors + 1))
else
    show_success "Configuración de CORS segura"
fi

# Verificar logs de debug
show_progress "Verificando configuración de logs..."
if grep -r "DEBUG" backend/src/main/resources/application.yml 2>/dev/null; then
    show_warning "Logs de DEBUG habilitados en configuración principal"
    warnings=$((warnings + 1))
else
    show_success "Configuración de logs apropiada"
fi

# Verificar H2 Console
show_progress "Verificando H2 Console..."
if grep -r "h2.*console.*enabled.*true" backend/src/main/resources/application-prod.yml 2>/dev/null; then
    show_error "H2 Console habilitado en producción"
    errors=$((errors + 1))
else
    show_success "H2 Console no habilitado en producción"
fi

echo ""
echo -e "${YELLOW}3. VERIFICACIÓN DE ARCHIVOS SENSIBLES${NC}"
echo "======================================"

# Verificar archivos .env
show_progress "Verificando archivos .env..."
if find . -name ".env*" -not -path "./node_modules/*" 2>/dev/null | head -5; then
    show_warning "Se encontraron archivos .env (verificar que estén en .gitignore)"
    warnings=$((warnings + 1))
else
    show_success "No se encontraron archivos .env"
fi

# Verificar directorio uploads
show_progress "Verificando directorio uploads..."
if [ -d "backend/uploads" ]; then
    show_error "Directorio uploads existe en el repositorio"
    errors=$((errors + 1))
else
    show_success "Directorio uploads no está en el repositorio"
fi

# Verificar archivos de certificados
show_progress "Verificando archivos de certificados..."
cert_files=$(find . -name "*.jks" -o -name "*.p12" -o -name "*.pem" -o -name "*.key" -o -name "*.crt" 2>/dev/null | head -5)
if [ -n "$cert_files" ]; then
    show_warning "Se encontraron archivos de certificados:"
    echo "$cert_files"
    warnings=$((warnings + 1))
else
    show_success "No se encontraron archivos de certificados"
fi

echo ""
echo -e "${YELLOW}4. VERIFICACIÓN DE DEPENDENCIAS${NC}"
echo "================================="

# Verificar vulnerabilidades conocidas
show_progress "Verificando vulnerabilidades en dependencias..."
if command -v npm >/dev/null 2>&1; then
    cd frontend
    if npm audit --audit-level=high --json > /tmp/npm-audit.json 2>/dev/null; then
        vulnerabilities=$(cat /tmp/npm-audit.json | grep -o '"high":[0-9]*' | cut -d':' -f2 | head -1)
        if [ "$vulnerabilities" != "0" ] && [ -n "$vulnerabilities" ]; then
            show_warning "Se encontraron $vulnerabilities vulnerabilidades de alta severidad en npm"
            warnings=$((warnings + 1))
        else
            show_success "No se encontraron vulnerabilidades críticas en npm"
        fi
    else
        show_success "Verificación de npm completada"
    fi
    cd ..
else
    show_warning "npm no disponible para verificación de vulnerabilidades"
fi

echo ""
echo -e "${YELLOW}5. VERIFICACIÓN DE VARIABLES DE ENTORNO${NC}"
echo "============================================"

# Verificar variables críticas
show_progress "Verificando variables de entorno críticas..."
critical_vars=("JWT_SECRET" "DB_PASSWORD" "ADMIN_PASSWORD")
missing_vars=()

for var in "${critical_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    show_warning "Variables de entorno críticas no configuradas: ${missing_vars[*]}"
    show_warning "Asegurar que estén configuradas en el entorno de producción"
    warnings=$((warnings + 1))
else
    show_success "Variables de entorno críticas configuradas"
fi

echo ""
echo -e "${YELLOW}6. RESUMEN DE SEGURIDAD${NC}"
echo "========================"

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✅ VERIFICACIÓN DE SEGURIDAD EXITOSA${NC}"
    echo -e "${GREEN}✅ El sistema está listo para despliegue seguro${NC}"
    echo ""
    echo -e "${BLUE}Recomendaciones finales:${NC}"
    echo "• Configurar todas las variables de entorno en producción"
    echo "• Usar HTTPS únicamente"
    echo "• Configurar firewall apropiado"
    echo "• Habilitar monitoreo de seguridad"
    echo "• Realizar backups regulares"
    echo ""
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠️  VERIFICACIÓN COMPLETADA CON $warnings ADVERTENCIAS${NC}"
    echo -e "${YELLOW}⚠️  Revisar las advertencias antes del despliegue${NC}"
    echo ""
    echo -e "${BLUE}Acciones recomendadas:${NC}"
    echo "• Revisar y corregir las advertencias reportadas"
    echo "• Verificar configuraciones de producción"
    echo "• Confirmar variables de entorno"
    echo ""
    exit 0
else
    echo -e "${RED}❌ VERIFICACIÓN FALLÓ CON $errors ERRORES Y $warnings ADVERTENCIAS${NC}"
    echo -e "${RED}❌ CORREGIR ERRORES ANTES DEL DESPLIEGUE${NC}"
    echo ""
    echo -e "${YELLOW}Acciones requeridas:${NC}"
    echo "• Corregir todos los errores de seguridad reportados"
    echo "• Revisar SECURITY-PRODUCTION-CHECKLIST.md"
    echo "• Ejecutar nuevamente este script"
    echo ""
    exit 1
fi
