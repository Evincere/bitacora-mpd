package com.bitacora.infrastructure.rest.mapper;

import com.bitacora.domain.model.activity.ActivityHistory;
import com.bitacora.infrastructure.rest.dto.ActivityHistoryDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper para convertir entre ActivityHistory y ActivityHistoryDTO.
 */
@Component("activityHistoryDtoMapper")
public class ActivityHistoryMapper {

    /**
     * Convierte un modelo de dominio ActivityHistory a un DTO ActivityHistoryDTO.
     *
     * @param history El modelo de dominio ActivityHistory
     * @return El DTO ActivityHistoryDTO
     */
    public ActivityHistoryDTO toDto(ActivityHistory history) {
        if (history == null) {
            return null;
        }

        return ActivityHistoryDTO.builder()
                .id(history.getId())
                .activityId(history.getActivityId())
                .userId(history.getUserId())
                .userName(history.getUserName())
                .previousStatus(history.getPreviousStatus())
                .newStatus(history.getNewStatus())
                .changeDate(history.getChangeDate())
                .notes(history.getNotes())
                .build();
    }

    /**
     * Convierte una lista de modelos de dominio ActivityHistory a una lista de DTOs ActivityHistoryDTO.
     *
     * @param historyList Lista de modelos de dominio ActivityHistory
     * @return Lista de DTOs ActivityHistoryDTO
     */
    public List<ActivityHistoryDTO> toDtoList(List<ActivityHistory> historyList) {
        if (historyList == null) {
            return null;
        }

        return historyList.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
