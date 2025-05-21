package com.bitacora.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Propiedades de configuración para el almacenamiento de archivos.
 */
@Configuration
@ConfigurationProperties(prefix = "bitacora.file.storage")
public class FileStorageProperties {

    /**
     * Directorio donde se almacenarán los archivos subidos.
     */
    private String uploadDir = "uploads";

    /**
     * Tamaño máximo permitido para los archivos subidos (en bytes).
     */
    private long maxFileSize = 10 * 1024 * 1024; // 10MB por defecto

    /**
     * Tipos MIME permitidos para los archivos subidos.
     */
    private String[] allowedFileTypes = {
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain",
            "image/jpeg",
            "image/png",
            "image/gif",
            "application/zip",
            "application/x-rar-compressed"
    };

    /**
     * Obtiene el directorio de subida de archivos.
     *
     * @return El directorio de subida
     */
    public String getUploadDir() {
        return uploadDir;
    }

    /**
     * Establece el directorio de subida de archivos.
     *
     * @param uploadDir El directorio de subida
     */
    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    /**
     * Obtiene el tamaño máximo permitido para los archivos.
     *
     * @return El tamaño máximo en bytes
     */
    public long getMaxFileSize() {
        return maxFileSize;
    }

    /**
     * Establece el tamaño máximo permitido para los archivos.
     *
     * @param maxFileSize El tamaño máximo en bytes
     */
    public void setMaxFileSize(long maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    /**
     * Obtiene los tipos MIME permitidos para los archivos.
     *
     * @return Array de tipos MIME permitidos
     */
    public String[] getAllowedFileTypes() {
        return allowedFileTypes;
    }

    /**
     * Establece los tipos MIME permitidos para los archivos.
     *
     * @param allowedFileTypes Array de tipos MIME permitidos
     */
    public void setAllowedFileTypes(String[] allowedFileTypes) {
        this.allowedFileTypes = allowedFileTypes;
    }
}
