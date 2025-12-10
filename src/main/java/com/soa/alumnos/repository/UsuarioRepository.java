package com.soa.alumnos.repository;

import com.soa.alumnos.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByUsername(String username);

    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
