// src/main/java/com/auth/service/AuthService.java
package com.auth.impl;

import com.auth.model.User;
import com.auth.model.dto.AuthResponse;
import com.auth.model.dto.AuthenticationRequest;
import com.auth.repository.UserRepository;
import java.time.OffsetDateTime;
import java.util.Optional;

import com.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;

    @Override
    public AuthResponse registerOrGet(AuthenticationRequest request) {
        Optional<User> existing = userRepository.findByFireBaseUid(request.uid());
        User user = existing.orElseGet(() -> User.builder().fireBaseUid(request.uid()).build());

        if (request.email() != null) user.setEmail(request.email());
        if (request.displayName() != null) user.setDisplayName(request.displayName());
        if (request.photoUrl() != null) user.setPhotoUrl(request.photoUrl());
        if (request.providerId() != null) user.setProvider(request.providerId());

        if (user.getId() == null) user.setLastLoginAt(OffsetDateTime.now());

        User saved = userRepository.save(user);
        return new AuthResponse(
                saved.getId(),
                saved.getFireBaseUid(),
                saved.getEmail(),
                saved.getDisplayName(),
                saved.getPhotoUrl(),
                saved.getProvider()
        );
    }

    @Override
    public AuthResponse login(AuthenticationRequest request) {
        Optional<User> existing = userRepository.findByFireBaseUid(request.uid());
        User user = existing.orElseGet(() -> User.builder().fireBaseUid(request.uid()).build());

        if (request.email() != null) user.setEmail(request.email());
        if (request.displayName() != null) user.setDisplayName(request.displayName());
        if (request.photoUrl() != null) user.setPhotoUrl(request.photoUrl());
        if (request.providerId() != null) user.setProvider(request.providerId());

        user.setLastLoginAt(OffsetDateTime.now());

        User saved = userRepository.save(user);
        return new AuthResponse(
                saved.getId(),
                saved.getFireBaseUid(),
                saved.getEmail(),
                saved.getDisplayName(),
                saved.getPhotoUrl(),
                saved.getProvider()
        );
    }
}
