package com.bitacora.application.taskrequest.mapper;

import com.bitacora.application.taskrequest.dto.TaskRequestHistoryDto;
import com.bitacora.domain.model.taskrequest.TaskRequestHistory;

import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre entidades de dominio y DTOs relacionados con historial de solicitudes de tareas.
 */
@Component
public class TaskRequestHistoryMapper {

    /**
     * Convierte una entidad TaskRequestHistory a un DTO TaskRequestHistoryDto.
     *
     * @param history La entidad a convertir
     * @return El DTO resultante
     */
    public TaskRequestHistoryDto toDto(final TaskRequestHistory history) {
        if (history == null) {
            return null;
        }

        return TaskRequestHistoryDto.builder()
                .id(history.getId())
                .taskRequestId(history.getTaskRequestId())
                .userId(history.getUserId())
                .userName(history.getUserName())
                .previousStatus(history.getPreviousStatus() != null ? history.getPreviousStatus().name() : null)
                .newStatus(history.getNewStatus() != null ? history.getNewStatus().name() : null)
                .changeDate(history.getChangeDate())
                .notes(history.getNotes())
                .build();
    }

    /**
     * Convierte una lista de entidades TaskRequestHistory a una lista de DTOs TaskRequestHistoryDto.
     *
     * @param historyList La lista de entidades a convertir
     * @return La lista de DTOs resultante
     */
    public List<TaskRequestHistoryDto> toDtoList(final List<TaskRequestHistory> historyList) {
        if (historyList == null) {
            return Collections.emptyList();
        }

        return historyList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
