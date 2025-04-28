package com.bitacora.infrastructure.exception;

/**
 * Enumeración de códigos de error.
 * Cada código de error tiene un prefijo que indica el tipo de error.
 */
public enum ErrorCode {

    // Errores de autenticación (AUTH_*)
    AUTH_INVALID_CREDENTIALS("AUTH_001"),
    AUTH_EXPIRED_TOKEN("AUTH_002"),
    AUTH_INVALID_TOKEN("AUTH_003"),
    AUTH_INSUFFICIENT_PERMISSIONS("AUTH_004"),
    AUTH_USER_DISABLED("AUTH_005"),
    AUTH_INVALID_REFRESH_TOKEN("AUTH_006"),

    // Errores de validación (VAL_*)
    VAL_MISSING_FIELD("VAL_001"),
    VAL_INVALID_FORMAT("VAL_002"),
    VAL_CONSTRAINT_VIOLATION("VAL_003"),

    // Errores de recursos (RES_*)
    RES_NOT_FOUND("RES_001"),
    RES_ALREADY_EXISTS("RES_002"),
    RES_CONFLICT("RES_003"),

    // Errores de operación (OP_*)
    OP_INVALID_STATE("OP_001"),
    OP_TIMEOUT("OP_002"),
    OP_CONCURRENT_MODIFICATION("OP_003"),

    // Errores del sistema (SYS_*)
    SYS_INTERNAL_ERROR("SYS_001"),
    SYS_SERVICE_UNAVAILABLE("SYS_002"),
    SYS_DATABASE_ERROR("SYS_003"),
    SYS_EXTERNAL_SERVICE_ERROR("SYS_004");

    private final String code;

    ErrorCode(final String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
