package com.bitacora.application.taskrequest.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/**
 * DTO para transferir información paginada de solicitudes de tareas.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskRequestPageDto {
    private List<TaskRequestDto> taskRequests;
    private int totalPages;
    private long totalItems;
    private int currentPage;

    // Constructor por defecto
    public TaskRequestPageDto() {
    }

    // Constructor con builder
    private TaskRequestPageDto(Builder builder) {
        this.taskRequests = builder.taskRequests;
        this.totalPages = builder.totalPages;
        this.totalItems = builder.totalItems;
        this.currentPage = builder.currentPage;
    }

    // Getters
    public List<TaskRequestDto> getTaskRequests() {
        return taskRequests;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public long getTotalItems() {
        return totalItems;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    // Builder
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private List<TaskRequestDto> taskRequests;
        private int totalPages;
        private long totalItems;
        private int currentPage;

        private Builder() {
        }

        public Builder taskRequests(List<TaskRequestDto> taskRequests) {
            this.taskRequests = taskRequests;
            return this;
        }

        public Builder totalPages(int totalPages) {
            this.totalPages = totalPages;
            return this;
        }

        public Builder totalItems(long totalItems) {
            this.totalItems = totalItems;
            return this;
        }

        public Builder currentPage(int currentPage) {
            this.currentPage = currentPage;
            return this;
        }

        public TaskRequestPageDto build() {
            return new TaskRequestPageDto(this);
        }
    }
}
