package com.soa.alumnos.repository;

import com.soa.alumnos.entity.Alumno;
import com.soa.alumnos.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AlumnoRepository extends JpaRepository<Alumno, String> {
    boolean existsByCedula(String cedula);
    Alumno findByCedula(String cedula);
    
    @Query("SELECT a.curso FROM Alumno a WHERE a.cedula = :cedula")
    Curso findCursoByCedula(@Param("cedula") String cedula);

    @Query("SELECT a FROM Alumno a WHERE a.curso.idCurso = :idCurso")
    List<Alumno> listarAlumnosPorCurso(@Param("idCurso") Integer idCurso);
    
    // Contar alumnos asociados a un curso
    long countByCurso_IdCurso(Integer idCurso);

}
