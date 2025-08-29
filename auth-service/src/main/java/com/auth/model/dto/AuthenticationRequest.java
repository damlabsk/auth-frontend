package com.auth.model.dto;

public record AuthenticationRequest(
        String uid,
        String email,
        String displayName,
        String photoUrl,
        String providerId
) {}
