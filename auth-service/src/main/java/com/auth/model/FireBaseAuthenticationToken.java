package com.auth.model;

import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Map;

public class FireBaseAuthenticationToken extends AbstractAuthenticationToken {
    private final String uid;
    private final String email;
    private final Map<String, Object> claims;

    public FireBaseAuthenticationToken(
            String uid,
            String email,
            Map<String, Object> claims,
            Collection<? extends GrantedAuthority> authorities
    ) {
        super(authorities);
        this.uid = uid;
        this.email = email;
        this.claims = claims;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return uid;
    }

    public String getUid() {
        return uid;
    }

    public String getEmail() {
        return email;
    }

    public Map<String, Object> getClaims() {
        return claims;
    }
}
