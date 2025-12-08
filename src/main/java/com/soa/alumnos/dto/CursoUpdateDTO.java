package com.soa.alumnos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CursoUpdateDTO(
        @NotBlank(message = "El nombre del curso es obligatorio")
        @Size(min = 3, max = 30, message = "El nombre del curso debe tener entre 3 y 30 caracteres")
        String nombreCurso,
        
        @NotBlank(message = "El paralelo es obligatorio")
        @Size(min = 1, max = 1, message = "El paralelo debe ser exactamente un carácter")
        @Pattern(regexp = "^[A-Za-z]$", message = "El paralelo debe ser una sola letra (A-Z)")
        String paralelo
) {
}
