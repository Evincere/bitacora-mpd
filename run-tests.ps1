# Cambiar al directorio backend
Set-Location -Path ".\backend"

# Ejecutar las pruebas
Write-Host "Ejecutando pruebas para ActivityExtendedTest..."
& mvn test "-Dtest=com.bitacora.domain.model.activity.ActivityExtendedTest"

Write-Host "Ejecutando pruebas para ActivityStateTest..."
& mvn test "-Dtest=com.bitacora.domain.model.activity.state.ActivityStateTest"

Write-Host "Ejecutando pruebas para ActivityStatusNewTest..."
& mvn test "-Dtest=com.bitacora.domain.model.activity.ActivityStatusNewTest"

Write-Host "Ejecutando pruebas para ActivityWorkflowServiceTest..."
& mvn test "-Dtest=com.bitacora.application.activity.ActivityWorkflowServiceTest"

Write-Host "Ejecutando pruebas para ActivityWorkflowControllerTest..."
& mvn test "-Dtest=com.bitacora.infrastructure.rest.controller.ActivityWorkflowControllerTest"

Write-Host "Ejecutando pruebas para ActivityWorkflowIntegrationTest..."
& mvn test "-Dtest=com.bitacora.integration.ActivityWorkflowIntegrationTest"

# Volver al directorio original
Set-Location -Path ".."
