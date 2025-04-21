#!/bin/bash

echo "==================================================="
echo "Bitacora MPD - Pruebas de Rendimiento"
echo "==================================================="

# Verificar si JMeter está instalado
if ! command -v jmeter &> /dev/null; then
    echo "ERROR: JMeter no está instalado o no está en el PATH."
    echo "Por favor, instale JMeter desde https://jmeter.apache.org/download_jmeter.cgi"
    echo "y asegúrese de que esté en el PATH del sistema."
    exit 1
fi

# Crear directorio para resultados
mkdir -p results

# Obtener fecha y hora actual para el nombre del archivo
timestamp=$(date +"%Y%m%d_%H%M%S")
result_file="results/bitacora_performance_${timestamp}"

echo "Ejecutando pruebas de rendimiento..."
echo "Archivo de resultados: ${result_file}.jtl"

# Ejecutar JMeter en modo no GUI
jmeter -n -t jmeter/bitacora-load-test.jmx -l "${result_file}.jtl" -e -o "${result_file}_report"

if [ $? -ne 0 ]; then
    echo "ERROR: La prueba de rendimiento falló."
    exit 1
fi

echo ""
echo "Pruebas de rendimiento completadas exitosamente."
echo "Informe HTML generado en: ${result_file}_report/index.html"
echo ""

# Abrir el informe en el navegador predeterminado (dependiendo del sistema)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "${result_file}_report/index.html"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "${result_file}_report/index.html" &> /dev/null
fi

exit 0
