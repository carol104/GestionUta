package com.soa.alumnos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "alumnos")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Alumno {
    @Id
    @Column(name="CEDULA", length = 10)
    private String cedula;
    @Column(name="NOMBRE", nullable = false, length = 20)
    private String nombre;
    @Column(name="APELLIDO", nullable = false, length = 20)
    private String apellido;
    @Column(name="DIRECCION", nullable = false, length = 50)
    private String direccion;
    @Column(name="TELEFONO", nullable = false, length = 10,  unique = true)
    private String telefono;
    @ManyToOne
    @JoinColumn(name="id_curso")
    private Curso curso;
}
