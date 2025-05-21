package com.bitacora.infrastructure.rest.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Clase que representa una respuesta de error estandarizada.
 */
@Data
public class ErrorResponse {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    private int status;
    
    private String error;
    
    private String message;
    
    private List<String> details;

    /**
     * Constructor por defecto.
     */
    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
        this.details = new ArrayList<>();
    }

    /**
     * Constructor con parámetros básicos.
     *
     * @param status  El código de estado HTTP
     * @param error   El tipo de error
     * @param message El mensaje de error
     */
    public ErrorResponse(int status, String error, String message) {
        this();
        this.status = status;
        this.error = error;
        this.message = message;
    }

    /**
     * Constructor con parámetros completos.
     *
     * @param status  El código de estado HTTP
     * @param error   El tipo de error
     * @param message El mensaje de error
     * @param details Los detalles del error
     */
    public ErrorResponse(int status, String error, String message, List<String> details) {
        this(status, error, message);
        this.details = details;
    }

    /**
     * Añade un detalle al error.
     *
     * @param detail El detalle a añadir
     */
    public void addDetail(String detail) {
        if (this.details == null) {
            this.details = new ArrayList<>();
        }
        this.details.add(detail);
    }
}
