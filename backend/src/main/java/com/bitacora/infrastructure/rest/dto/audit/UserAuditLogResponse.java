package com.bitacora.infrastructure.rest.dto.audit;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para la respuesta paginada de registros de auditoría.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAuditLogResponse {
    
    /**
     * Lista de registros de auditoría.
     */
    private List<UserAuditLogDTO> content;
    
    /**
     * Número de página actual (0-based).
     */
    private int page;
    
    /**
     * Tamaño de página.
     */
    private int size;
    
    /**
     * Número total de registros.
     */
    private long totalElements;
    
    /**
     * Número total de páginas.
     */
    private int totalPages;
    
    /**
     * Indica si es la primera página.
     */
    private boolean first;
    
    /**
     * Indica si es la última página.
     */
    private boolean last;
    
    /**
     * Constructor con parámetros básicos.
     * 
     * @param content Lista de registros de auditoría
     * @param page Número de página actual (0-based)
     * @param size Tamaño de página
     * @param totalElements Número total de registros
     */
    public UserAuditLogResponse(List<UserAuditLogDTO> content, int page, int size, long totalElements) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = size > 0 ? (int) Math.ceil((double) totalElements / size) : 0;
        this.first = page == 0;
        this.last = page >= totalPages - 1;
    }
}
