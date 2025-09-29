package com.proyecto1.demo.Models.DAO;

import java.util.List;
import com.proyecto1.demo.Models.Entity.Categoria;

public interface CategoriaDAO {
    List<Categoria> encontrarTodos();
    Categoria encontrarPorId(Long id);
    void guardar(Categoria categoria);
    void actualizar(Categoria categoria);
    void eliminar(Long id);
}