package com.auth.repository;

import java.util.Optional;
import com.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByFireBaseUid(String FirebaseUid);
    Optional<User> findByEmail(String email);
}
