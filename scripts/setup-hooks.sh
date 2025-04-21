#!/bin/bash

# Script para configurar hooks de git
# Ejecutar este script una vez para configurar los hooks

echo "Configurando hooks de git..."

# Crear directorio para hooks si no existe
mkdir -p .git/hooks

# Crear hook de pre-commit
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Hook de pre-commit para verificar configuraciones antes de hacer commit

# Ejecutar script de verificación
./scripts/verify-configs.sh

# Si el script falla, abortar el commit
if [ $? -ne 0 ]; then
    echo "ERROR: La verificación de configuraciones falló. Commit abortado."
    exit 1
fi

# Verificar si hay cambios en archivos de configuración
git diff --cached --name-only | grep -E '\.xml$|\.json$|\.yml$|\.yaml$' > /dev/null

if [ $? -eq 0 ]; then
    echo "ADVERTENCIA: Está haciendo commit de cambios en archivos de configuración."
    echo "Asegúrese de que estos cambios sean intencionales y estén documentados."
    
    # Opcional: Pedir confirmación
    read -p "¿Desea continuar con el commit? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Commit abortado por el usuario."
        exit 1
    fi
fi

exit 0
EOF

# Hacer el hook ejecutable
chmod +x .git/hooks/pre-commit

echo "Hook de pre-commit configurado correctamente"
echo "Este hook verificará las configuraciones antes de cada commit"

# Crear hook de post-merge
cat > .git/hooks/post-merge << 'EOF'
#!/bin/bash

# Hook de post-merge para verificar configuraciones después de un pull/merge

# Verificar si hay cambios en archivos de configuración
git diff HEAD@{1}..HEAD --name-only | grep -E '\.xml$|\.json$|\.yml$|\.yaml$' > /dev/null

if [ $? -eq 0 ]; then
    echo "ADVERTENCIA: Se han actualizado archivos de configuración."
    echo "Se recomienda ejecutar ./scripts/verify-configs.sh para verificar su validez."
fi

exit 0
EOF

# Hacer el hook ejecutable
chmod +x .git/hooks/post-merge

echo "Hook de post-merge configurado correctamente"
echo "Este hook le advertirá cuando se actualicen archivos de configuración"

echo "Configuración de hooks completada"
