package com.bitacora.domain.model.audit;

/**
 * Enumeración que define los tipos de acciones que pueden ser auditadas en el sistema.
 */
public enum AuditActionType {
    /**
     * Acción de inicio de sesión en el sistema.
     */
    LOGIN("Inicio de sesión"),
    
    /**
     * Acción de cierre de sesión en el sistema.
     */
    LOGOUT("Cierre de sesión"),
    
    /**
     * Acción de creación de un nuevo recurso.
     */
    CREATE("Creación"),
    
    /**
     * Acción de lectura o visualización de un recurso.
     */
    READ("Lectura"),
    
    /**
     * Acción de actualización o modificación de un recurso existente.
     */
    UPDATE("Actualización"),
    
    /**
     * Acción de eliminación de un recurso.
     */
    DELETE("Eliminación"),
    
    /**
     * Acción de cambio de estado de un recurso.
     */
    STATUS_CHANGE("Cambio de estado"),
    
    /**
     * Acción de asignación de un recurso a un usuario.
     */
    ASSIGN("Asignación"),
    
    /**
     * Acción de reasignación de un recurso a otro usuario.
     */
    REASSIGN("Reasignación"),
    
    /**
     * Acción de aprobación de un recurso.
     */
    APPROVE("Aprobación"),
    
    /**
     * Acción de rechazo de un recurso.
     */
    REJECT("Rechazo"),
    
    /**
     * Acción de descarga de un archivo.
     */
    DOWNLOAD("Descarga"),
    
    /**
     * Acción de carga de un archivo.
     */
    UPLOAD("Carga"),
    
    /**
     * Acción de exportación de datos.
     */
    EXPORT("Exportación"),
    
    /**
     * Acción de importación de datos.
     */
    IMPORT("Importación"),
    
    /**
     * Acción de cambio de permisos o roles.
     */
    PERMISSION_CHANGE("Cambio de permisos"),
    
    /**
     * Acción de configuración del sistema.
     */
    CONFIGURATION("Configuración"),
    
    /**
     * Acción de ejecución de un proceso o tarea.
     */
    EXECUTE("Ejecución"),
    
    /**
     * Acción de envío de notificación.
     */
    NOTIFICATION("Notificación"),
    
    /**
     * Acción de comentario en un recurso.
     */
    COMMENT("Comentario"),
    
    /**
     * Acción de búsqueda en el sistema.
     */
    SEARCH("Búsqueda"),
    
    /**
     * Acción de visualización de un reporte.
     */
    REPORT_VIEW("Visualización de reporte"),
    
    /**
     * Acción de generación de un reporte.
     */
    REPORT_GENERATE("Generación de reporte"),
    
    /**
     * Acción no categorizada o desconocida.
     */
    OTHER("Otra");
    
    private final String displayName;
    
    AuditActionType(String displayName) {
        this.displayName = displayName;
    }
    
    /**
     * Obtiene el nombre para mostrar de la acción.
     * 
     * @return Nombre para mostrar
     */
    public String getDisplayName() {
        return displayName;
    }
}
