package com.soa.alumnos.services;

import com.soa.alumnos.dto.AlumnoCreateDTO;
import com.soa.alumnos.dto.AlumnoUpdateDTO;
import com.soa.alumnos.entity.Alumno;
import com.soa.alumnos.entity.Curso;
import com.soa.alumnos.repository.AlumnoRepository;
import com.soa.alumnos.repository.CursoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlumnosService {
    private final AlumnoRepository repo;

    private final CursoRepository repoCurso;

    public AlumnosService(AlumnoRepository repo, CursoRepository repoCurso) {
        this.repo = repo;
        this.repoCurso = repoCurso;
    }

    public List<Alumno> listar() {
        return repo.findAll();
    }

    public Alumno crear(AlumnoCreateDTO dto) {
        if (repo.existsByCedula(dto.cedula())) {
            throw new IllegalArgumentException("Ya existe un alumno con cédula " + dto.cedula());
        }
        Curso c = repoCurso.findById(dto.idCurso())
                .orElseThrow(() -> new IllegalArgumentException("Curso no encontrado con ID: " + dto.idCurso()));
        Alumno a = Alumno.builder().cedula(dto.cedula())
                .nombre(dto.nombre())
                .apellido(dto.apellido())
                .direccion(dto.direccion())
                .telefono(dto.telefono())
                .curso(c)
                .build();
        return repo.save(a);

    }

    public Alumno editar(String cedula, AlumnoUpdateDTO dto) {
        if (!repo.existsByCedula(cedula)) {
            throw new IllegalArgumentException("No xiste un alumno con cédula " + cedula);
        }
        Alumno a = buscarPorCedula(cedula);
        a.setNombre(dto.nombre());
        a.setApellido(dto.apellido());
        a.setDireccion(dto.direccion());
        a.setTelefono(dto.telefono());
        Curso c = repoCurso.findById(dto.idCurso())
                .orElseThrow(() -> new IllegalArgumentException("Curso no encontrado con ID: " + dto.idCurso()));
        a.setCurso(c);
        return repo.save(a);
    }

    public Alumno buscarPorCedula(String cedula) {
        return repo.findById(cedula)
                .orElseThrow(() -> new EntityNotFoundException("Aluno no encontrado" + cedula));
    }

    public Curso obtenerCursoPorCedula(String cedula) {
        return repo.findCursoByCedula(cedula);
    }
    public void eliminar(String cedula) {
        if (!repo.existsByCedula(cedula)) {
            throw new IllegalArgumentException("No existe un alumno con cédula " + cedula);
        }
        repo.deleteById(cedula);

    }

    // Listar alumnos de un curso específico
    public List<Alumno> listarAlumnosPorCurso(Integer idCurso) {
        if (!repoCurso.existsById(idCurso)) {
            throw new IllegalArgumentException("Curso no encontrado con ID: " + idCurso);
        }
        return repo.listarAlumnosPorCurso(idCurso);
    }

}
