package com.soa.alumnos.services;

import com.soa.alumnos.entity.Usuario;
import com.soa.alumnos.repository.UsuarioRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = repo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // 1. Validar si el usuario está activo
        if (!usuario.getActivo()) {
            throw new UsernameNotFoundException("El usuario está inactivo");
        }

        // 2. Convertir tu Enum Rol a una autoridad de Spring
        // Spring espera el formato "ROLE_NOMBRE", por eso concatenamos "ROLE_"
        String rolSpring = "ROLE_" + usuario.getRol().name(); // Ejemplo: "ROLE_ADMIN"

        List<GrantedAuthority> autoridades = Collections.singletonList(new SimpleGrantedAuthority(rolSpring));

        // 3. Retornar el objeto User de Spring
        return new User(
                usuario.getUsername(),
                usuario.getPassword(),
                autoridades
        );
    }

    // Método para registrar usando tu Builder
    public Usuario registrar(Usuario usuario) {
        // Encriptar la clave antes de guardar
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return repo.save(usuario);
    }

    // Método para registrar usuario desde el formulario
    public Usuario registrarUsuario(com.soa.alumnos.dto.UsuarioRegisterDTO dto) {
        // Validar que el usuario no exista
        if (repo.existsByUsername(dto.username())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso");
        }

        if (repo.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        // Validar el rol
        Usuario.Rol rol;
        try {
            rol = Usuario.Rol.valueOf(dto.rol());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Rol inválido. Use ADMIN o SECRETARIA");
        }

        // Crear el usuario
        Usuario usuario = Usuario.builder()
                .username(dto.username())
                .email(dto.email())
                .nombre(dto.nombre())
                .password(passwordEncoder.encode(dto.password()))
                .rol(rol)
                .activo(true)
                .build();

        return repo.save(usuario);
    }
}
