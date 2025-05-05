package com.bitacora.infrastructure.rest.error;

import com.bitacora.domain.exception.CommentException;
import com.bitacora.domain.exception.DomainException;
import com.bitacora.domain.exception.EntityNotFoundException;
import com.bitacora.domain.exception.TaskRequestException;
import com.bitacora.infrastructure.exception.InvalidTokenException;
import com.bitacora.infrastructure.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Manejador global de excepciones para la API REST.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Maneja excepciones de dominio.
     *
     * @param ex      La excepción
     * @param request La solicitud HTTP
     * @return Una respuesta de error
     */
    @ExceptionHandler(DomainException.class)
    public ResponseEntity<ApiError> handleDomainException(DomainException ex, HttpServletRequest request) {
        log.error("Error de dominio: {}", ex.getMessage(), ex);

        HttpStatus status = HttpStatus.BAD_REQUEST;
        if (ex instanceof EntityNotFoundException) {
            status = HttpStatus.NOT_FOUND;
        }

        ApiError apiError = ApiError.of(
                status,
                ex.getMessage(),
                request.getRequestURI());

        return new ResponseEntity<>(apiError, status);
    }

    /**
     * Maneja excepciones de tipo CommentException.
     *
     * @param ex      La excepción
     * @param request La solicitud HTTP
     * @return Una respuesta de error
     */
    @ExceptionHandler(CommentException.class)
    public ResponseEntity<ApiError> handleCommentException(CommentException ex, HttpServletRequest request) {
        log.error("Error en operación de comentario: {}", ex.getMessage(), ex);

        HttpStatus status;
        switch (ex.getErrorCode()) {
            case COMMENT_NOT_FOUND:
                status = HttpStatus.NOT_FOUND;
                break;
            case PERMISSION_DENIED:
                status = HttpStatus.FORBIDDEN;
                break;
            case INVALID_CONTENT:
                status = HttpStatus.BAD_REQUEST;
                break;
            default:
                status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        ApiError apiError = ApiError.of(
                status,
                ex.getMessage(),
                request.getRequestURI());
        apiError.addDetail("Error code: " + ex.getErrorCode().toString());

        return new ResponseEntity<>(apiError, status);
    }

    /**
     * Maneja excepciones de tipo TaskRequestException.
     *
     * @param ex      La excepción
     * @param request La solicitud HTTP
     * @return Una respuesta de error
     */
    @ExceptionHandler(TaskRequestException.class)
    public ResponseEntity<ApiError> handleTaskRequestException(TaskRequestException ex, HttpServletRequest request) {
        log.error("Error en operación de solicitud de tarea: {}", ex.getMessage(), ex);

        HttpStatus status;
        switch (ex.getErrorCode()) {
            case TASK_REQUEST_NOT_FOUND:
                status = HttpStatus.NOT_FOUND;
                break;
            case PERMISSION_DENIED:
                status = HttpStatus.FORBIDDEN;
                break;
            case INVALID_STATE_TRANSITION:
                status = HttpStatus.BAD_REQUEST;
                break;
            default:
                status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        ApiError apiError = ApiError.of(
                status,
                ex.getMessage(),
                request.getRequestURI());
        apiError.addDetail("Error code: " + ex.getErrorCode().toString());

        return new ResponseEntity<>(apiError, status);
    }

    /**
     * Maneja excepciones de validación.
     *
     * @param ex      La excepción
     * @param request La solicitud HTTP
     * @return Una respuesta de error
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationException(MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        log.error("Error de validación: {}", ex.getMessage());

        List<String> details = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::formatFieldError)
                .collect(Collectors.toList());

        ApiError apiError = ApiError.of(
                HttpStatus.BAD_REQUEST,
                "Error de validación",
                request.getRequestURI(),
                details);

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    /**
     * Maneja excepciones de violación de restricciones.
     *
     * @param ex      La excepción
     * @param request La solicitud HTTP
     * @return Una respuesta de error
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraintViolationException(ConstraintViolationException ex,
            HttpServletRequest request) {
        log.error("Error de validación: {}", ex.getMessage());

        List<String> details = ex.getConstraintViolations()
                .stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .collect(Collectors.toList());

        ApiError apiError = ApiError.of(
                HttpStatus.BAD_REQUEST,
                "Error de validación",
                request.getRequestURI(),
                details);

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    /**
     * Maneja excepciones de autenticación.
     *
     * @param ex      La excepción
     * @param request La solicitud HTTP
     * @return Una respuesta de error
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuthenticationException(AuthenticationException ex,
            HttpServletRequest request) {
        log.error("Error de autenticación: {}", ex.getMessage());

        String message = "Error de autenticación";
        if (ex instanceof BadCredentialsException) {
            message = "Credenciales inválidas";
        }

        ApiError apiError = ApiError.of(
                HttpStatus.UNAUTHORIZED,
                message,
                request.getRequestURI());

        return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Maneja excepciones de acceso denegado.
     *
     * @param ex      La excepción
     * @param request La solicitud HTTP
     * @return Una respuesta de error
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest request) {
        log.error("Acceso denegado: {}", ex.getMessage());

        ApiError apiError = ApiError.of(
                HttpStatus.FORBIDDEN,
                "No tiene permisos para realizar esta acción",
                request.getRequestURI());

        return new ResponseEntity<>(apiError, HttpStatus.FORBIDDEN);
    }

    /**
     * Maneja excepciones de tipo de argumento incorrecto.
     *
     * @param ex      La excepción
     * @param request La solicitud HTTP
     * @return Una respuesta de error
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex,
            HttpServletRequest request) {
        log.error("Error de tipo de argumento: {}", ex.getMessage());

        String message = String.format(
                "El parámetro '%s' debería ser de tipo '%s'",
                ex.getName(),
                Optional.ofNullable(ex.getRequiredType())
                        .map(Class::getSimpleName)
                        .orElse("desconocido"));

        ApiError apiError = ApiError.of(
                HttpStatus.BAD_REQUEST,
                message,
                request.getRequestURI());

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    /**
     * Maneja excepciones de parámetro faltante.
     *
     * @param ex      La excepción
     * @param request La solicitud HTTP
     * @return Una respuesta de error
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiError> handleMissingServletRequestParameterException(
            MissingServletRequestParameterException ex, HttpServletRequest request) {
        log.error("Parámetro faltante: {}", ex.getMessage());

        String message = String.format(
                "El parámetro '%s' es requerido",
                ex.getParameterName());

        ApiError apiError = ApiError.of(
                HttpStatus.BAD_REQUEST,
                message,
                request.getRequestURI());

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    /**
     * Maneja excepciones de enlace.
     *
     * @param ex      La excepción
     * @param request La solicitud HTTP
     * @return Una respuesta de error
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiError> handleBindException(BindException ex, HttpServletRequest request) {
        log.error("Error de enlace: {}", ex.getMessage());

        List<String> details = new ArrayList<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            details.add(formatFieldError(error));
        });

        ApiError apiError = ApiError.of(
                HttpStatus.BAD_REQUEST,
                "Error de validación",
                request.getRequestURI(),
                details);

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    /**
     * Maneja excepciones de token inválido.
     *
     * @param ex      La excepción
     * @param request La solicitud HTTP
     * @return Una respuesta de error
     */
    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ApiError> handleInvalidToken(InvalidTokenException ex, HttpServletRequest request) {
        log.error("Token inválido: {}", ex.getMessage());

        ApiError apiError = ApiError.of(
                HttpStatus.UNAUTHORIZED,
                ex.getMessage(),
                request.getRequestURI());
        apiError.addDetail("El token proporcionado no es válido o ha expirado");

        return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Maneja excepciones de recurso no encontrado.
     *
     * @param ex      La excepción
     * @param request La solicitud HTTP
     * @return Una respuesta de error
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        log.error("Recurso no encontrado: {}", ex.getMessage());

        ApiError apiError = ApiError.of(
                HttpStatus.NOT_FOUND,
                ex.getMessage(),
                request.getRequestURI());

        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }

    /**
     * Maneja excepciones de elemento no encontrado.
     *
     * @param ex      La excepción
     * @param request La solicitud HTTP
     * @return Una respuesta de error
     */
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiError> handleNoSuchElement(NoSuchElementException ex, HttpServletRequest request) {
        log.error("Elemento no encontrado: {}", ex.getMessage());

        ApiError apiError = ApiError.of(
                HttpStatus.NOT_FOUND,
                "El recurso solicitado no existe",
                request.getRequestURI());

        if (ex.getMessage() != null) {
            apiError.addDetail(ex.getMessage());
        }

        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }

    /**
     * Maneja excepciones genéricas.
     *
     * @param ex      La excepción
     * @param request La solicitud HTTP
     * @return Una respuesta de error
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(Exception ex, HttpServletRequest request) {
        log.error("Error interno del servidor: {}", ex.getMessage(), ex);

        ApiError apiError = ApiError.of(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error interno del servidor",
                request.getRequestURI());

        if (ex.getMessage() != null) {
            apiError.addDetail(ex.getMessage());
        }

        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Formatea un error de campo.
     *
     * @param error El error de campo
     * @return El error formateado
     */
    private String formatFieldError(FieldError error) {
        return String.format(
                "El campo '%s' %s",
                error.getField(),
                error.getDefaultMessage());
    }
}
