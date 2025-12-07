package com.soa.alumnos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CursoUpdateDTO(
        @NotBlank(message = "El nombre del curso es obligatorio")
        @Size(min = 3, max = 30, message = "El nombre del curso debe tener entre 3 y 30 caracteres")
        String nombreCurso,
        
        @NotBlank(message = "El paralelo es obligatorio")
        @Size(min = 1, max = 10, message = "El paralelo no puede exceder 10 caracteres")
        String paralelo
) {
}
