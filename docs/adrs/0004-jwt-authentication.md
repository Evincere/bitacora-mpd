# 4. Autenticación basada en JWT

Fecha: 2023-02-05

## Estado

Aceptado

## Contexto

Necesitamos implementar un mecanismo de autenticación y autorización para la aplicación que:

1. Sea seguro y siga las mejores prácticas
2. Soporte diferentes roles y permisos
3. Sea escalable para futuras expansiones
4. Funcione bien en una arquitectura de API RESTful
5. No requiera estado en el servidor (stateless)

Estamos considerando varias opciones:
- Autenticación basada en sesiones
- Autenticación basada en tokens JWT
- OAuth 2.0 / OpenID Connect
- Autenticación basada en API keys

## Decisión

Implementaremos autenticación basada en tokens JWT (JSON Web Tokens) con las siguientes características:

1. **Flujo de autenticación**:
   - El usuario proporciona credenciales (usuario/contraseña)
   - El servidor valida las credenciales y genera un token JWT
   - El cliente almacena el token y lo incluye en las solicitudes posteriores
   - El servidor valida el token en cada solicitud

2. **Estructura del token**:
   - Header: Algoritmo de firma (HS256)
   - Payload:
     - sub: ID del usuario
     - roles: Roles del usuario
     - permissions: Permisos específicos
     - iat: Fecha de emisión
     - exp: Fecha de expiración (24 horas)
   - Signature: Firma HMAC-SHA256

3. **Almacenamiento**:
   - Frontend: localStorage para persistencia entre sesiones
   - Backend: No almacena tokens (stateless)

4. **Seguridad**:
   - Tokens firmados con una clave secreta robusta
   - HTTPS obligatorio para todas las comunicaciones
   - Validación de tokens en cada solicitud
   - Expiración de tokens después de 24 horas
   - Posibilidad de revocar tokens (lista negra)

## Consecuencias

### Positivas

- **Stateless**: No requiere almacenar estado de sesión en el servidor
- **Escalabilidad**: Funciona bien en entornos distribuidos
- **Flexibilidad**: Puede contener información de usuario y permisos
- **Estándar**: JWT es un estándar ampliamente adoptado
- **Rendimiento**: Reduce consultas a la base de datos para información de usuario

### Negativas

- **Tamaño**: Los tokens JWT pueden ser relativamente grandes
- **Revocación**: La revocación de tokens antes de su expiración requiere una lista negra
- **Exposición de información**: El payload del token es visible (aunque no modificable)
- **Seguridad del cliente**: Riesgos asociados al almacenamiento en localStorage (XSS)

## Mitigación de Riesgos

1. **Expiración corta**: Tokens con vida útil limitada (24 horas)
2. **Refresh tokens**: Implementar tokens de actualización para sesiones más largas
3. **Sanitización**: Prevención de XSS en el frontend
4. **Validación estricta**: Validar completamente los tokens en el backend
5. **Rotación de claves**: Cambiar periódicamente la clave de firma

## Referencias

- [Introducción a JWT](https://jwt.io/introduction)
- [RFC 7519 - JSON Web Token](https://tools.ietf.org/html/rfc7519)
- [OWASP - JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [Spring Security JWT](https://www.baeldung.com/spring-security-jwt)
