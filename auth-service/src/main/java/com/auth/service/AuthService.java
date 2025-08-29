package com.auth.service;

import com.auth.model.dto.AuthResponse;
import com.auth.model.dto.AuthenticationRequest;

public interface AuthService {
    AuthResponse registerOrGet(AuthenticationRequest request);
    AuthResponse login(AuthenticationRequest request);
}
