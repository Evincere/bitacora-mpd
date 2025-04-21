package com.bitacora.infrastructure.rest.error;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Clase que representa un error de API estandarizado.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    
    private int status;
    
    private String error;
    
    private String message;
    
    private String path;
    
    @Builder.Default
    private List<String> details = new ArrayList<>();
    
    /**
     * Crea un ApiError a partir de un HttpStatus.
     * 
     * @param status El estado HTTP
     * @param message El mensaje de error
     * @param path La ruta de la solicitud
     * @return Un nuevo ApiError
     */
    public static ApiError of(HttpStatus status, String message, String path) {
        return ApiError.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(path)
                .build();
    }
    
    /**
     * Crea un ApiError a partir de un HttpStatus con detalles.
     * 
     * @param status El estado HTTP
     * @param message El mensaje de error
     * @param path La ruta de la solicitud
     * @param details Los detalles del error
     * @return Un nuevo ApiError
     */
    public static ApiError of(HttpStatus status, String message, String path, List<String> details) {
        ApiError apiError = of(status, message, path);
        apiError.setDetails(details);
        return apiError;
    }
    
    /**
     * Agrega un detalle al error.
     * 
     * @param detail El detalle a agregar
     * @return El ApiError actualizado
     */
    public ApiError addDetail(String detail) {
        this.details.add(detail);
        return this;
    }
}
