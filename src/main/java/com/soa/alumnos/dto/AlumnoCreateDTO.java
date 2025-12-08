package com.soa.alumnos.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AlumnoCreateDTO(
        @NotBlank(message = "La cédula es obligatoria")
        @Pattern(regexp = "^[0-9]{10}$", message = "La cédula debe tener exactamente 10 dígitos")
        String cedula,
        
        @NotBlank(message = "El nombre es obligatorio")
        @Size(min = 3, max = 20, message = "El nombre debe tener entre 3 y 20 caracteres")
        @Pattern(regexp = "^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$", message = "El nombre solo puede contener letras y espacios")
        String nombre,
        
        @NotBlank(message = "El apellido es obligatorio")
        @Size(min = 3, max = 20, message = "El apellido debe tener entre 3 y 20 caracteres")
        @Pattern(regexp = "^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$", message = "El apellido solo puede contener letras y espacios")
        String apellido,
        
        @NotBlank(message = "La dirección es obligatoria")
        @Size(max = 50, message = "La dirección no puede exceder 50 caracteres")
        String direccion,
        
        @NotBlank(message = "El teléfono es obligatorio")
        @Pattern(regexp = "^[0-9]{10}$", message = "El teléfono debe tener exactamente 10 dígitos")
        String telefono,
        
        @NotNull(message = "Debe asignar un curso")
        Integer idCurso
) {

}
