@echo off
echo Iniciando la aplicación Bitácora...
echo.
echo Iniciando el backend...
start cmd /k "cd backend && call run-h2.bat"
echo.
echo Esperando a que el backend se inicie (10 segundos)...
timeout /t 10 /nobreak
echo.
echo Iniciando el frontend...
start cmd /k "cd frontend && npm run dev"
echo.
echo Abriendo la aplicación en el navegador...
timeout /t 5 /nobreak
start http://localhost:3000
echo.
echo ¡Aplicación iniciada correctamente!
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8080/api
echo - Consola H2: http://localhost:8080/api/h2-console
