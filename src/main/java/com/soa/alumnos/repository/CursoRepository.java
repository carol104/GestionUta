package com.soa.alumnos.repository;

import com.soa.alumnos.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CursoRepository extends JpaRepository<Curso, Integer > {
}
