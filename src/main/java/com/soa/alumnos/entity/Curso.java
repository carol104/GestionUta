package com.soa.alumnos.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="cursos")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_curso")
    private int idCurso;

    @Column(name="nombre_curso", length = 30)
    private String nombreCurso;

    @Column(name="paralelo")
    private String paralelo;


}
