package com.bitacora.domain.model.audit;

/**
 * Enumeración que define los posibles resultados de una acción auditada.
 */
public enum AuditResult {
    /**
     * La acción se completó con éxito.
     */
    SUCCESS("Éxito"),
    
    /**
     * La acción falló debido a un error.
     */
    ERROR("Error"),
    
    /**
     * La acción fue denegada por falta de permisos.
     */
    DENIED("Denegado"),
    
    /**
     * La acción fue cancelada por el usuario.
     */
    CANCELLED("Cancelado"),
    
    /**
     * La acción está en progreso.
     */
    IN_PROGRESS("En progreso"),
    
    /**
     * La acción expiró por tiempo de espera.
     */
    TIMEOUT("Tiempo agotado"),
    
    /**
     * La acción fue parcialmente exitosa.
     */
    PARTIAL("Parcial"),
    
    /**
     * El resultado de la acción es desconocido.
     */
    UNKNOWN("Desconocido");
    
    private final String displayName;
    
    AuditResult(String displayName) {
        this.displayName = displayName;
    }
    
    /**
     * Obtiene el nombre para mostrar del resultado.
     * 
     * @return Nombre para mostrar
     */
    public String getDisplayName() {
        return displayName;
    }
}
