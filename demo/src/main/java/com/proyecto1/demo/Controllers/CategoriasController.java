package com.proyecto1.demo.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto1.demo.Models.DAO.CategoriaDAO;
import com.proyecto1.demo.Models.Entity.Categoria;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoriasController {
    
    @Autowired
    private CategoriaDAO categoriaDAO;


    @GetMapping()
    public ResponseEntity<List<Categoria>> getAllCategorias() {
        try{
            return ResponseEntity.ok(categoriaDAO.encontrarTodos());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
