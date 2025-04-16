package com.bitacora.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Activity {
    private Long id;
    private LocalDateTime date;
    private String type;
    private String description;
    private String person;
    private String role;
    private String dependency;
    private String situation;
    private String result;
    private String status;
    private LocalDateTime lastStatusChangeDate;
    private String comments;
    private String agent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;
}
