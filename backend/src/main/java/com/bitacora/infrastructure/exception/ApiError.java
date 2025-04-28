package com.bitacora.infrastructure.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Clase que representa un error de API.
 * Se utiliza para devolver respuestas de error estructuradas.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiError {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    private HttpStatus status;

    private String message;

    private String path;

    private String error;

    private String errorCode;

    @Builder.Default
    private List<String> details = new ArrayList<>();

    /**
     * Constructor para crear un error de API con detalles.
     *
     * @param status    El estado HTTP
     * @param message   El mensaje de error
     * @param path      La ruta de la solicitud
     * @param error     El tipo de error
     * @param errorCode El código de error
     * @param details   Los detalles del error
     */
    public ApiError(final HttpStatus status, final String message, final String path, final String error,
            final String errorCode,
            final List<String> details) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.message = message;
        this.path = path;
        this.error = error;
        this.errorCode = errorCode;
        this.details = details;
    }

    /**
     * Constructor para crear un error de API sin detalles.
     *
     * @param status    El estado HTTP
     * @param message   El mensaje de error
     * @param path      La ruta de la solicitud
     * @param error     El tipo de error
     * @param errorCode El código de error
     */
    public ApiError(final HttpStatus status, final String message, final String path, final String error,
            final String errorCode) {
        this(status, message, path, error, errorCode, new ArrayList<>());
    }

    /**
     * Añade un detalle al error.
     *
     * @param detail El detalle a añadir
     */
    public void addDetail(final String detail) {
        if (this.details == null) {
            this.details = new ArrayList<>();
        }
        this.details.add(detail);
    }
}
