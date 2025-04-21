#!/bin/bash

# Script para verificar la validez de los archivos de configuración
# Ejecutar este script antes de hacer commit para evitar problemas

echo "Verificando archivos de configuración..."
echo "========================================="

# Crear directorio para logs
mkdir -p logs

# Función para verificar archivos XML
verify_xml() {
    local file=$1
    echo "Verificando $file..."

    if [ ! -f "$file" ]; then
        echo "ERROR: El archivo $file no existe"
        return 1
    fi

    # Verificar sintaxis XML
    xmllint --noout "$file" 2>logs/xmllint_$(basename "$file").log

    if [ $? -ne 0 ]; then
        echo "ERROR: El archivo $file contiene errores de sintaxis XML"
        echo "Ver detalles en logs/xmllint_$(basename "$file").log"
        return 1
    else
        echo "OK: El archivo $file es válido"
        return 0
    fi
}

# Función para verificar configuración de Checkstyle
verify_checkstyle() {
    local file=$1
    echo "Verificando configuración de Checkstyle..."

    # Verificar sintaxis XML
    verify_xml "$file" || return 1

    # Verificar propiedades de Checkstyle
    # Nota: En algunas versiones de Checkstyle, 'scope' fue reemplazado por 'accessModifiers'
    # pero en nuestra versión actual (10.12.5) seguimos usando 'scope'
    if grep -q "JavadocMethod.*accessModifiers.*value=\"public\"" "$file" || grep -q "MissingJavadocMethod.*accessModifiers.*value=\"public\"" "$file"; then
        echo "ADVERTENCIA: El archivo $file contiene propiedades 'accessModifiers' que no son compatibles con nuestra versión de Checkstyle"
        echo "Considere usar 'scope' en lugar de 'accessModifiers' para estos módulos"
        return 1
    fi

    echo "OK: Configuración de Checkstyle válida"
    return 0
}

# Función para verificar configuración de PMD
verify_pmd() {
    local file=$1
    echo "Verificando configuración de PMD..."

    # Verificar sintaxis XML
    verify_xml "$file" || return 1

    # Verificar versión del esquema
    if ! grep -q "ruleset/2.0.0" "$file"; then
        echo "ADVERTENCIA: El archivo $file podría estar usando una versión obsoleta del esquema"
        return 1
    fi

    echo "OK: Configuración de PMD válida"
    return 0
}

# Función para verificar configuración de SpotBugs
verify_spotbugs() {
    local file=$1
    echo "Verificando configuración de SpotBugs..."

    # Verificar sintaxis XML
    verify_xml "$file" || return 1

    # Verificar namespace
    if ! grep -q "xmlns=\"https://github.com/spotbugs/filter/3.0.0\"" "$file"; then
        echo "ADVERTENCIA: El archivo $file podría estar usando un namespace obsoleto"
        return 1
    fi

    echo "OK: Configuración de SpotBugs válida"
    return 0
}

# Función para verificar configuración de Maven
verify_maven() {
    local file=$1
    echo "Verificando configuración de Maven..."

    # Verificar sintaxis XML
    verify_xml "$file" || return 1

    # Verificar etiquetas básicas
    if ! grep -q "<name>" "$file"; then
        echo "ADVERTENCIA: El archivo $file no contiene la etiqueta <name>"
        return 1
    fi

    echo "OK: Configuración de Maven válida"
    return 0
}

# Verificar archivos de configuración
errors=0

# Verificar pom.xml
verify_maven "backend/pom.xml"
[ $? -ne 0 ] && errors=$((errors + 1))

# Verificar checkstyle.xml
verify_checkstyle "backend/checkstyle.xml"
[ $? -ne 0 ] && errors=$((errors + 1))

# Verificar pmd-ruleset.xml
verify_pmd "backend/pmd-ruleset.xml"
[ $? -ne 0 ] && errors=$((errors + 1))

# Verificar spotbugs-exclude.xml
verify_spotbugs "backend/spotbugs-exclude.xml"
[ $? -ne 0 ] && errors=$((errors + 1))

# Resumen
echo ""
echo "Resumen de verificación"
echo "======================="

if [ $errors -eq 0 ]; then
    echo "Todos los archivos de configuración son válidos"
    exit 0
else
    echo "Se encontraron $errors errores en los archivos de configuración"
    echo "Por favor, corrija los errores antes de hacer commit"
    exit 1
fi
