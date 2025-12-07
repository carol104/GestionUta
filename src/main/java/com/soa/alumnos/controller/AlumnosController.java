package com.soa.alumnos.controller;

import com.soa.alumnos.dto.AlumnoCreateDTO;
import com.soa.alumnos.dto.AlumnoUpdateDTO;
import com.soa.alumnos.entity.Alumno;
import com.soa.alumnos.entity.Curso;
import com.soa.alumnos.services.AlumnosService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumnos")
public class AlumnosController {

    private final AlumnosService service;

    public AlumnosController(AlumnosService service) {
        this.service = service;
    }

    @GetMapping
    public List<Alumno> listar() {
        return service.listar();
    }

    // Busca al alumno por su cédula
    @GetMapping("/{cedula}")
    public Alumno buscar(@PathVariable String cedula) {
        return service.buscarPorCedula(cedula);
    }

    // CORREGIDO: Se agregó "/curso" para evitar el error "Ambiguous mapping"
    @GetMapping("/{cedula}/curso")
    public Curso buscarCurso(@PathVariable String cedula){
        return service.obtenerCursoPorCedula(cedula);
    }


    @GetMapping("/por-curso/{id_curso}")
    public List<Alumno> alumnos(@PathVariable int id_curso) {
        return service.listarAlumnosPorCurso(id_curso);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Alumno crear(@Valid @RequestBody AlumnoCreateDTO dto) {
        return service.crear(dto);
    }

    @PutMapping("/{cedula}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public Alumno editar(@PathVariable String cedula, @Valid @RequestBody AlumnoUpdateDTO dto) {
        return service.editar(cedula, dto);
    }

    @DeleteMapping("/{cedula}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable String cedula) {
        service.eliminar(cedula);
    }
}