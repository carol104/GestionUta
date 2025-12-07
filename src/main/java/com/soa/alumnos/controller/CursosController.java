package com.soa.alumnos.controller;

import com.soa.alumnos.dto.CursoUpdateDTO;
import com.soa.alumnos.entity.Curso;
import com.soa.alumnos.services.CursosService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
public class CursosController {

    // Se recomienda hacerlo final para garantizar inmutabilidad
    private final CursosService service;

    public CursosController(CursosService service) {
        this.service = service;
    }

    @GetMapping
    public List<Curso> listar() {
        return service.listar();
    }

    @PostMapping
    public Curso insertar(@Valid @RequestBody CursoUpdateDTO c) {
        return service.insertar(c);
    }

    @PutMapping("/{id}")
    public Curso editar(@PathVariable int id, @Valid @RequestBody CursoUpdateDTO c) {
        return service.editar(id, c);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable int id) {
        service.eliminar(id);
    }
}