package com.proyecto1.demo.Models.DAO;

import java.util.List;
import com.proyecto1.demo.Models.Entity.Factura_Detalles;

public interface Factura_DetallesDAO {
    List<Factura_Detalles> encontrarTodos();
    Factura_Detalles encontrarPorId(Long id);
    List<Factura_Detalles> encontrarPorFactura(Long facturaId);
    List<Factura_Detalles> encontrarPorProducto(Long productoId);
    void guardar(Factura_Detalles facturaDetalle);
    void guardarTodos(List<Factura_Detalles> detalles);
    void actualizar(Factura_Detalles facturaDetalle);
    void eliminar(Long id);
    void eliminarPorFactura(Long facturaId);
}