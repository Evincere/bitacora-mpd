#!/bin/bash
echo "Iniciando la aplicación Bitácora MPD..."
echo

echo "Verificando si es necesario generar tipos TypeScript..."
read -p "¿Desea generar los tipos TypeScript desde OpenAPI? (s/n) [n]: " GENERATE_TYPES
GENERATE_TYPES=${GENERATE_TYPES:-n}

if [ "${GENERATE_TYPES,,}" = "s" ]; then
    echo
    echo "Generando tipos TypeScript desde OpenAPI..."
    cd backend
    # Intentar con el script normal primero
    bash generate-typescript.sh
    RESULT=$?

    # Si falla, usar el script manual
    if [ $RESULT -ne 0 ]; then
        echo "Intentando generar tipos TypeScript manualmente..."
        bash create-openapi-manual.sh
        RESULT=$?
    fi

    cd ..
    echo

    if [ $RESULT -ne 0 ]; then
        echo "Error al generar los tipos TypeScript. Continuando con el inicio de la aplicación..."
        echo
    else
        echo "Tipos TypeScript generados correctamente."
        echo
    fi
fi

echo "Iniciando el backend..."
cd backend
# Especificar la clase principal para evitar ambigüedades
mvn spring-boot:run -Dspring-boot.run.main-class=com.bitacora.BitacoraApplication &
BACKEND_PID=$!
cd ..
echo

echo "Esperando a que el backend se inicie (15 segundos)..."
sleep 15
echo

echo "Iniciando el frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..
echo

echo "Esperando a que el frontend se inicie (5 segundos)..."
sleep 5
echo

echo "Abriendo la aplicación en el navegador..."
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
    open http://localhost:3000
else
    echo "No se pudo abrir el navegador automáticamente. Por favor, abra http://localhost:3000 manualmente."
fi
echo

echo "¡Aplicación iniciada correctamente!"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8080/api"
echo "- Consola H2: http://localhost:8080/api/h2-console"
echo
echo "Credenciales de prueba:"
echo "- Usuario administrador: admin / Admin@123"
echo "- Usuario regular: usuario / Usuario@123"
echo "- Usuario de prueba: testuser / test123"
echo
echo "Presione Ctrl+C para detener la aplicación"

# Esperar a que el usuario presione Ctrl+C
wait $BACKEND_PID $FRONTEND_PID
