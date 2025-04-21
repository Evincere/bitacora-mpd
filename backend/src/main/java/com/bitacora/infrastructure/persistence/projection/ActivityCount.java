package com.bitacora.infrastructure.persistence.projection;

/**
 * Proyección que contiene información de conteo de actividades por tipo o estado.
 * Esta interfaz se utiliza para optimizar las consultas de estadísticas.
 */
public interface ActivityCount {
    
    /**
     * Obtiene la categoría (tipo o estado).
     *
     * @return La categoría
     */
    String getCategory();
    
    /**
     * Obtiene el conteo de actividades.
     *
     * @return El conteo de actividades
     */
    Long getCount();
}
