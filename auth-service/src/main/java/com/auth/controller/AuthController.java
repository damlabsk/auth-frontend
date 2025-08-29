package com.auth.controller;

import com.auth.model.FireBaseAuthenticationToken;
import com.auth.model.dto.AuthResponse;
import com.auth.model.dto.AuthenticationRequest;
import com.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Collections;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000"}, allowCredentials = "true")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(Authentication authentication, @RequestBody(required = false) AuthenticationRequest body) {
        FireBaseAuthenticationToken auth = (FireBaseAuthenticationToken) authentication;
        Map<String, Object> claims = auth.getClaims();
        AuthenticationRequest merged = merge(auth, claims, body);
        return authService.registerOrGet(merged);
    }

    @PostMapping("/login")
    public AuthResponse login(Authentication authentication, @RequestBody(required = false) AuthenticationRequest body) {
        FireBaseAuthenticationToken auth = (FireBaseAuthenticationToken) authentication;
        Map<String, Object> claims = auth.getClaims();
        AuthenticationRequest merged = merge(auth, claims, body);
        return authService.login(merged);
    }

    @GetMapping("/me")
    public AuthResponse me(Authentication authentication) {
        FireBaseAuthenticationToken auth = (FireBaseAuthenticationToken) authentication;
        Map<String, Object> c = auth.getClaims();
        String name = c.get("name") instanceof String s ? s : null;
        String picture = c.get("picture") instanceof String s ? s : null;
        String provider = extractProvider(c);
        return new AuthResponse(null, auth.getUid(), auth.getEmail(), name, picture, provider);
    }

    @GetMapping("/test")
    public String test() {
        return "Hello World";
    }

    private AuthenticationRequest merge(FireBaseAuthenticationToken auth, Map<String, Object> claims, AuthenticationRequest body) {
        String uid = auth.getUid();
        String email = auth.getEmail();
        String displayName = body != null && body.displayName() != null ? body.displayName() : claims.get("name") instanceof String s ? s : null;
        String photoUrl = body != null && body.photoUrl() != null ? body.photoUrl() : claims.get("picture") instanceof String s ? s : null;
        String providerId = body != null && body.providerId() != null ? body.providerId() : extractProvider(claims);
        return new AuthenticationRequest(uid, email, displayName, photoUrl, providerId);
    }

    private String extractProvider(Map<String, Object> claims) {
        Object firebase = claims.get("firebase");
        if (firebase instanceof Map<?, ?> f) {
            Object p = ((Map<?, ?>) f).get("sign_in_provider");
            if (p != null) return String.valueOf(p);
        }
        return null;
    }
    
}