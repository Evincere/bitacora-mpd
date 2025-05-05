package com.bitacora.domain.exception;

/**
 * Excepción específica para operaciones relacionadas con comentarios.
 */
public class CommentException extends RuntimeException {

    private final CommentErrorCode errorCode;

    /**
     * Constructor con mensaje de error y código de error.
     *
     * @param message   Mensaje descriptivo del error
     * @param errorCode Código de error específico
     */
    public CommentException(final String message, final CommentErrorCode errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    /**
     * Constructor con mensaje de error, causa y código de error.
     *
     * @param message   Mensaje descriptivo del error
     * @param cause     Causa original de la excepción
     * @param errorCode Código de error específico
     */
    public CommentException(final String message, final Throwable cause, final CommentErrorCode errorCode) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    /**
     * Obtiene el código de error asociado a esta excepción.
     *
     * @return El código de error
     */
    public CommentErrorCode getErrorCode() {
        return errorCode;
    }

    /**
     * Enumeración de códigos de error específicos para comentarios.
     */
    public enum CommentErrorCode {
        /**
         * El comentario no existe.
         */
        COMMENT_NOT_FOUND,
        
        /**
         * El contenido del comentario es inválido (vacío, demasiado largo, etc.).
         */
        INVALID_CONTENT,
        
        /**
         * El usuario no tiene permiso para realizar la operación en el comentario.
         */
        PERMISSION_DENIED,
        
        /**
         * Error al guardar el comentario en la base de datos.
         */
        SAVE_ERROR,
        
        /**
         * Error al marcar el comentario como leído.
         */
        MARK_AS_READ_ERROR,
        
        /**
         * Error al editar el comentario.
         */
        EDIT_ERROR,
        
        /**
         * Error al eliminar el comentario.
         */
        DELETE_ERROR
    }
}
