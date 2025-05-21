package com.bitacora.infrastructure.rest.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

import lombok.extern.slf4j.Slf4j;

/**
 * Manejador de excepciones para errores relacionados con la carga de archivos.
 */
@ControllerAdvice
@Slf4j
public class FileUploadExceptionHandler {

    /**
     * Maneja excepciones cuando se excede el tamaño máximo de carga.
     *
     * @param e La excepción lanzada
     * @return Respuesta con el mensaje de error
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxSizeException(MaxUploadSizeExceededException e) {
        log.error("Error de tamaño máximo de archivo excedido: {}", e.getMessage(), e);
        
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "El tamaño del archivo excede el límite máximo permitido",
                "El archivo que intentas subir es demasiado grande. El tamaño máximo permitido es de 15MB.");
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * Maneja excepciones generales de carga de archivos multipart.
     *
     * @param e La excepción lanzada
     * @return Respuesta con el mensaje de error
     */
    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<ErrorResponse> handleMultipartException(MultipartException e) {
        log.error("Error en la carga de archivos multipart: {}", e.getMessage(), e);
        
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Error en la carga de archivos",
                "Se produjo un error al procesar los archivos adjuntos. Por favor, intenta nuevamente.");
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * Maneja excepciones de validación de tamaño de archivo.
     *
     * @param e La excepción lanzada
     * @return Respuesta con el mensaje de error
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException e) {
        log.error("Error de validación de archivo: {}", e.getMessage(), e);
        
        // Verificar si el mensaje está relacionado con el tamaño del archivo
        if (e.getMessage() != null && e.getMessage().contains("excede el tamaño máximo permitido")) {
            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.BAD_REQUEST.value(),
                    "Tamaño de archivo excedido",
                    e.getMessage());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
        
        // Si no está relacionado con el tamaño del archivo, devolver un error genérico
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new ErrorResponse(
                        HttpStatus.BAD_REQUEST.value(),
                        "Error en la solicitud",
                        e.getMessage()));
    }
}
