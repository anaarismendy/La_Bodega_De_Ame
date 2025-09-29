package com.proyecto1.demo.Models.DAO;

import java.util.List;

import com.proyecto1.demo.Models.Entity.Producto;

public interface ProductoDAO {

    List<Producto> findAll();
    Producto findById(Long productoId);
    void save(Producto producto);
    void update(long id, Producto producto);
    void delete(Long id);
}
