package com.proyecto1.demo.Models.DAO;

import java.util.List;
import com.proyecto1.demo.Models.Entity.Producto;

public interface ProductoDAO {
    List<Producto> encontrarTodos();
    Producto encontrarPorId(Long id);
    List<Producto> encontrarPorCategoria(Long categoriaId);
    List<Producto> encontrarConDescuento();
    List<Producto> encontrarPorRangoPrecio(Double precioMinimo, Double precioMaximo);
    void guardar(Producto producto);
    void actualizar(Producto producto);
    void eliminar(Long id);
    void actualizarStock(Long productoId, Long cantidad);
}