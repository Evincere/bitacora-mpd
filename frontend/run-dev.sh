#!/bin/bash

echo "Iniciando frontend en modo desarrollo..."

# Instalar dependencias si node_modules no existe
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias..."
    npm install
fi

# Iniciar el servidor de desarrollo
echo "Iniciando servidor de desarrollo en el puerto 3000..."
npm run dev
