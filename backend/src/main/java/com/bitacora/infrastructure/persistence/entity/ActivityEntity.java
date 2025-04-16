package com.bitacora.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
    
    @Column(nullable = false)
    private String type;
    
    @Column(nullable = false, length = 1000)
    private String description;
    
    private String person;
    
    private String role;
    
    private String dependency;
    
    @Column(length = 1000)
    private String situation;
    
    @Column(length = 1000)
    private String result;
    
    @Column(nullable = false)
    private String status;
    
    private LocalDateTime lastStatusChangeDate;
    
    @Column(length = 1000)
    private String comments;
    
    private String agent;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @Column(nullable = false)
    private Long userId;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (lastStatusChangeDate == null) {
            lastStatusChangeDate = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
