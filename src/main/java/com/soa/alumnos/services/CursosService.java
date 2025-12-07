package com.soa.alumnos.services;

import com.soa.alumnos.dto.CursoUpdateDTO;
import com.soa.alumnos.entity.Curso;
import com.soa.alumnos.repository.AlumnoRepository;
import com.soa.alumnos.repository.CursoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CursosService {
    private final CursoRepository repo;
    private final AlumnoRepository alumnoRepo;

    public CursosService(CursoRepository repo, AlumnoRepository alumnoRepo) {
        this.repo = repo;
        this.alumnoRepo = alumnoRepo;
    }

    public List<Curso> listar() {
        return repo.findAll();

    }




    public Curso insertar(CursoUpdateDTO dto) {
        Curso c = Curso.builder().nombreCurso(dto.nombreCurso()).paralelo(dto.paralelo()).build();
        return repo.save(c);
    }


    public Curso editar(int id, CursoUpdateDTO dto) {
        if (!repo.existsById(id)) {
            throw new IllegalArgumentException("Curso no encontrado con ID: " + id);
        }

        Curso actual = buscarPorId(id);
        actual.setNombreCurso(dto.nombreCurso());
        actual.setParalelo(dto.paralelo());
        return repo.save(actual);

    }


    public Curso buscarPorId(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Curso no encontrado con ID: " + id));
    }


    public void eliminar(int id) {
        if (!repo.existsById(id)) {
            throw new jakarta.persistence.EntityNotFoundException("Curso no encontrado con ID: " + id);
        }
        
        // Validar que el curso no tenga alumnos asociados
        long countAlumnos = alumnoRepo.countByCurso_IdCurso(id);
        if (countAlumnos > 0) {
            throw new IllegalStateException("No se puede eliminar el curso porque tiene " + countAlumnos + " alumno(s) asignado(s). Primero reasigne o elimine los alumnos.");
        }
        
        repo.deleteById(id);
    }
}
