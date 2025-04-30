package com.bitacora.domain.model.taskrequest;

/**
 * Enumeración que representa los niveles de prioridad para las solicitudes de tareas.
 */
public enum TaskRequestPriority {
    /**
     * Crítica: Máxima prioridad, requiere atención inmediata.
     */
    CRITICAL("Crítica", 1),
    
    /**
     * Alta: Prioridad elevada, debe ser atendida lo antes posible.
     */
    HIGH("Alta", 2),
    
    /**
     * Media: Prioridad estándar, debe ser atendida en tiempo razonable.
     */
    MEDIUM("Media", 3),
    
    /**
     * Baja: Prioridad reducida, puede esperar si hay tareas más importantes.
     */
    LOW("Baja", 4),
    
    /**
     * Trivial: Mínima prioridad, puede ser atendida cuando no haya otras tareas pendientes.
     */
    TRIVIAL("Trivial", 5);

    private final String displayName;
    private final int level;

    TaskRequestPriority(final String displayName, final int level) {
        this.displayName = displayName;
        this.level = level;
    }

    /**
     * Obtiene el nombre para mostrar de la prioridad.
     *
     * @return El nombre para mostrar
     */
    public String getDisplayName() {
        return displayName;
    }

    /**
     * Obtiene el nivel numérico de la prioridad (menor número = mayor prioridad).
     *
     * @return El nivel numérico
     */
    public int getLevel() {
        return level;
    }

    /**
     * Convierte una cadena en un valor de la enumeración TaskRequestPriority.
     *
     * @param priority La cadena a convertir
     * @return El valor de la enumeración correspondiente
     * @throws IllegalArgumentException Si la cadena no corresponde a ningún valor de la enumeración
     */
    public static TaskRequestPriority fromString(final String priority) {
        for (TaskRequestPriority p : TaskRequestPriority.values()) {
            if (p.name().equalsIgnoreCase(priority) 
                    || p.getDisplayName().equalsIgnoreCase(priority)) {
                return p;
            }
        }
        throw new IllegalArgumentException("Prioridad no válida: " + priority);
    }
}
