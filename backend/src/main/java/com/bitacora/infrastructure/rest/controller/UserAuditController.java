package com.bitacora.infrastructure.rest.controller;

import com.bitacora.application.audit.UserAuditService;
import com.bitacora.domain.model.audit.AuditActionType;
import com.bitacora.domain.model.audit.AuditResult;
import com.bitacora.domain.model.audit.UserAuditLog;
import com.bitacora.domain.port.repository.UserAuditLogRepository;
import com.bitacora.infrastructure.rest.dto.audit.MarkAsSuspiciousRequest;
import com.bitacora.infrastructure.rest.dto.audit.UserAuditLogDTO;
import com.bitacora.infrastructure.rest.dto.audit.UserAuditLogResponse;
import com.bitacora.infrastructure.rest.mapper.UserAuditLogDTOMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controlador REST para la gestión de auditoría de usuarios.
 */
@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@Tag(name = "Auditoría de Usuarios", description = "API para la gestión de auditoría de usuarios")
public class UserAuditController {

        private final UserAuditService auditService;
        private final UserAuditLogRepository auditLogRepository;
        private final UserAuditLogDTOMapper mapper;

        /**
         * Busca registros de auditoría con filtros combinados.
         */
        @GetMapping
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Buscar registros de auditoría", description = "Busca registros de auditoría con filtros combinados")
        public ResponseEntity<UserAuditLogResponse> searchAuditLogs(
                        @Parameter(description = "ID del usuario") @RequestParam(required = false) Long userId,
                        @Parameter(description = "Nombre de usuario") @RequestParam(required = false) String username,
                        @Parameter(description = "Tipo de acción") @RequestParam(required = false) AuditActionType actionType,
                        @Parameter(description = "Tipo de entidad") @RequestParam(required = false) String entityType,
                        @Parameter(description = "ID de la entidad") @RequestParam(required = false) String entityId,
                        @Parameter(description = "Resultado de la acción") @RequestParam(required = false) AuditResult result,
                        @Parameter(description = "Fecha de inicio") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
                        @Parameter(description = "Fecha de fin") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
                        @Parameter(description = "Indica si buscar registros sospechosos") @RequestParam(required = false) Boolean suspicious,
                        @Parameter(description = "Módulo del sistema") @RequestParam(required = false) String module,
                        @Parameter(description = "Número de página (0-based)") @RequestParam(defaultValue = "0") int page,
                        @Parameter(description = "Tamaño de página") @RequestParam(defaultValue = "20") int size) {

                List<UserAuditLog> auditLogs = auditService.searchAuditLogs(
                                userId, username, actionType, entityType, entityId,
                                result, startDate, endDate, suspicious, module, page, size);

                long total = auditService.countAuditLogs(
                                userId, username, actionType, entityType, entityId,
                                result, startDate, endDate, suspicious, module);

                List<UserAuditLogDTO> dtos = auditLogs.stream()
                                .map(mapper::toDTO)
                                .collect(Collectors.toList());

                UserAuditLogResponse response = new UserAuditLogResponse(dtos, page, size, total);

                return ResponseEntity.ok(response);
        }

        /**
         * Obtiene un registro de auditoría por su ID.
         */
        @GetMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Obtener registro de auditoría", description = "Obtiene un registro de auditoría por su ID")
        public ResponseEntity<UserAuditLogDTO> getAuditLogById(@PathVariable Long id) {
                return auditLogRepository.findById(id)
                                .map(mapper::toDTO)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        /**
         * Marca un registro de auditoría como sospechoso.
         */
        @PostMapping("/{id}/mark-suspicious")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Marcar como sospechoso", description = "Marca un registro de auditoría como sospechoso")
        public ResponseEntity<UserAuditLogDTO> markAsSuspicious(
                        @PathVariable Long id,
                        @Valid @RequestBody MarkAsSuspiciousRequest request) {

                return auditService.markAsSuspicious(id, request.getReason())
                                .map(mapper::toDTO)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        /**
         * Obtiene estadísticas de auditoría.
         */
        @GetMapping("/stats")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Obtener estadísticas", description = "Obtiene estadísticas de auditoría")
        public ResponseEntity<Map<String, Object>> getAuditStats(
                        @Parameter(description = "Fecha de inicio") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
                        @Parameter(description = "Fecha de fin") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

                // Implementar lógica para obtener estadísticas
                Map<String, Object> stats = new HashMap<>();

                // Ejemplo de estadísticas
                stats.put("totalLogs", auditService.countAuditLogs(null, null, null, null, null, null, startDate,
                                endDate, null, null));
                stats.put("suspiciousLogs", auditService.countAuditLogs(null, null, null, null, null, null, startDate,
                                endDate, true, null));

                // Contar por tipo de acción
                Map<String, Long> actionTypeCounts = new HashMap<>();
                for (AuditActionType actionType : AuditActionType.values()) {
                        long count = auditService.countAuditLogs(null, null, actionType, null, null, null, startDate,
                                        endDate, null, null);
                        actionTypeCounts.put(actionType.name(), count);
                }
                stats.put("byActionType", actionTypeCounts);

                return ResponseEntity.ok(stats);
        }

        /**
         * Exporta registros de auditoría a CSV.
         */
        @GetMapping("/export")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Exportar registros", description = "Exporta registros de auditoría a CSV")
        public ResponseEntity<byte[]> exportAuditLogs(
                        @Parameter(description = "ID del usuario") @RequestParam(required = false) Long userId,
                        @Parameter(description = "Nombre de usuario") @RequestParam(required = false) String username,
                        @Parameter(description = "Tipo de acción") @RequestParam(required = false) AuditActionType actionType,
                        @Parameter(description = "Tipo de entidad") @RequestParam(required = false) String entityType,
                        @Parameter(description = "ID de la entidad") @RequestParam(required = false) String entityId,
                        @Parameter(description = "Resultado de la acción") @RequestParam(required = false) AuditResult result,
                        @Parameter(description = "Fecha de inicio") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
                        @Parameter(description = "Fecha de fin") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
                        @Parameter(description = "Indica si buscar registros sospechosos") @RequestParam(required = false) Boolean suspicious,
                        @Parameter(description = "Módulo del sistema") @RequestParam(required = false) String module) {

                // Implementar lógica para exportar registros a CSV
                // Esta es una implementación básica, se debe mejorar para manejar grandes
                // volúmenes de datos

                List<UserAuditLog> auditLogs = auditService.searchAuditLogs(
                                userId, username, actionType, entityType, entityId,
                                result, startDate, endDate, suspicious, module, 0, Integer.MAX_VALUE);

                // Convertir a CSV
                StringBuilder csv = new StringBuilder();
                csv.append("ID,Usuario,Nombre,Acción,Entidad,ID Entidad,Descripción,IP,Fecha,Resultado,Sospechoso,Módulo\n");

                for (UserAuditLog log : auditLogs) {
                        csv.append(String.format("%d,%s,%s,%s,%s,%s,\"%s\",%s,%s,%s,%s,%s\n",
                                        log.getId(),
                                        log.getUsername(),
                                        log.getUserFullName(),
                                        log.getActionType(),
                                        log.getEntityType(),
                                        log.getEntityId(),
                                        log.getDescription().replace("\"", "\"\""), // Escapar comillas
                                        log.getIpAddress(),
                                        log.getTimestamp(),
                                        log.getResult(),
                                        log.isSuspicious(),
                                        log.getModule()));
                }

                byte[] csvBytes = csv.toString().getBytes();

                return ResponseEntity
                                .ok()
                                .header("Content-Type", "text/csv")
                                .header("Content-Disposition", "attachment; filename=\"audit_logs.csv\"")
                                .body(csvBytes);
        }
}
