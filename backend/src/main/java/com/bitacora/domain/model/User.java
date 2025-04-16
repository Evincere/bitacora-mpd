package com.bitacora.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String position;
    private String department;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<String> permissions;
}
