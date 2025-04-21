package com.bitacora.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entidad JPA que representa una actividad en la base de datos.
 */
@Entity
@Table(name = "activities")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String person;

    @Column(length = 100)
    private String role;

    @Column(length = 255)
    private String dependency;

    @Column(columnDefinition = "TEXT")
    private String situation;

    @Column(columnDefinition = "TEXT")
    private String result;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "last_status_change_date")
    private LocalDateTime lastStatusChangeDate;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(length = 255)
    private String agent;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Inicializa valores por defecto al crear una nueva entidad.
     */
    @PrePersist
    protected void onCreate() {
        if (lastStatusChangeDate == null) {
            lastStatusChangeDate = LocalDateTime.now();
        }
    }
}
