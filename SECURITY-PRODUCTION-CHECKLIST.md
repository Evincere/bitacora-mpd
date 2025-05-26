# 🔒 CHECKLIST DE SEGURIDAD PARA PRODUCCIÓN

## ⚠️ CONFIGURACIONES CRÍTICAS REQUERIDAS

### **Variables de Entorno Obligatorias**

Estas variables **DEBEN** configurarse antes del despliegue en producción:

```bash
# CRÍTICO: JWT Secret - Generar una clave segura de al menos 256 bits
export JWT_SECRET="tu-clave-jwt-super-segura-de-al-menos-256-bits-aqui"

# Base de datos
export DB_HOST="tu-servidor-postgresql"
export DB_PORT="5432"
export DB_NAME="bitacora_prod"
export DB_USERNAME="bitacora_user"
export DB_PASSWORD="contraseña-super-segura"

# CORS - Solo dominios de producción
export CORS_ALLOWED_ORIGINS="https://tu-dominio-produccion.com"

# Configuración de datos iniciales
export ADMIN_PASSWORD="contraseña-admin-super-segura"
export SEMPER_PASSWORD="contraseña-semper-super-segura"

# Configuración de seguridad
export ALLOW_BEAN_OVERRIDING="false"
export ALLOW_CIRCULAR_REFERENCES="false"

# Logs de producción
export LOG_LEVEL="WARN"
export APP_LOG_LEVEL="INFO"
export SPRING_WEB_LOG_LEVEL="WARN"
```

### **Configuraciones de Seguridad Aplicadas**

✅ **JWT Secret**: Eliminado valor por defecto hardcodeado
✅ **CORS**: Removidas URLs de desarrollo
✅ **Bean Overriding**: Deshabilitado por defecto
✅ **Circular References**: Deshabilitado por defecto
✅ **Logs**: Configurados para producción (INFO/WARN)
✅ **Uploads**: Directorio removido del repositorio

### **Verificaciones de Seguridad**

#### 1. **Generar JWT Secret Seguro**
```bash
# Generar una clave segura de 256 bits
openssl rand -base64 32
```

#### 2. **Verificar Configuración de Base de Datos**
- ✅ Usuario específico para la aplicación (no root/postgres)
- ✅ Contraseña fuerte
- ✅ Conexión SSL habilitada
- ✅ Firewall configurado

#### 3. **Configuración de CORS**
- ✅ Solo dominios de producción permitidos
- ✅ No wildcards (*) en producción
- ✅ HTTPS únicamente

#### 4. **Configuración de Logs**
- ✅ Nivel INFO o superior en producción
- ✅ No logs de DEBUG en producción
- ✅ Rotación de logs configurada

### **Archivos a Revisar Antes del Despliegue**

1. **docker-compose.yml**: Verificar que JWT_SECRET no tenga valor por defecto
2. **application.yml**: Confirmar que configuraciones críticas usen variables de entorno
3. **.env**: Asegurar que no esté en el repositorio
4. **uploads/**: Confirmar que esté en .gitignore

### **Comandos de Verificación**

```bash
# Verificar que no hay secrets hardcodeados
grep -r "bitacoraSecretKey" backend/src/
grep -r "metres-dispatch-takes-reserve" backend/src/

# Verificar configuración de CORS
grep -r "allowed-origins" backend/src/

# Verificar configuración de logs
grep -r "DEBUG" backend/src/main/resources/
```

### **Configuración de Perfiles de Spring**

Para producción, usar:
```bash
--spring.profiles.active=prod,configurable-data-init,prod-data
```

### **Monitoreo de Seguridad**

1. **Logs de Seguridad**: Monitorear intentos de acceso fallidos
2. **Métricas de JWT**: Monitorear tokens expirados/inválidos
3. **Conexiones de Base de Datos**: Monitorear conexiones sospechosas
4. **CORS**: Monitorear requests desde dominios no autorizados

### **Backup y Recuperación**

1. **Base de Datos**: Backup automático diario
2. **Configuraciones**: Backup de variables de entorno
3. **Logs**: Retención de logs de seguridad por 90 días

## 🚨 ADVERTENCIAS CRÍTICAS

### **NO HACER EN PRODUCCIÓN**

❌ **NO** usar valores por defecto para JWT_SECRET
❌ **NO** habilitar H2 Console
❌ **NO** usar perfiles de desarrollo
❌ **NO** exponer endpoints de debug
❌ **NO** usar HTTP en lugar de HTTPS
❌ **NO** permitir CORS desde cualquier origen
❌ **NO** usar contraseñas débiles
❌ **NO** habilitar logs de DEBUG

### **Verificación Final**

Antes del despliegue, ejecutar:
```bash
# Script de verificación de seguridad
./scripts/security-scan.sh

# Verificación de configuración
./scripts/verify-configs.sh

# Testing sin mocks
./scripts/test-no-mocks.sh
```

## 📞 CONTACTO DE EMERGENCIA

En caso de problemas de seguridad en producción:
1. Cambiar inmediatamente JWT_SECRET
2. Revisar logs de acceso
3. Verificar integridad de la base de datos
4. Contactar al equipo de seguridad

---

**Fecha de última actualización**: Diciembre 2024
**Versión**: 1.0
**Estado**: ✅ APLICADO
