package com.auth.model.dto;
public record AuthResponse(
        Long id,
        String uid,
        String email,
        String displayName,
        String photoUrl,
        String provider
) {}