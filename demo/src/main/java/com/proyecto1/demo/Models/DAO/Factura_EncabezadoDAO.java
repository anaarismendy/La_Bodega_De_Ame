package com.proyecto1.demo.Models.DAO;

import java.util.List;
import java.time.LocalDate;
import com.proyecto1.demo.Models.Entity.Factura_Encabezado;

public interface Factura_EncabezadoDAO {
    List<Factura_Encabezado> encontrarTodos();
    Factura_Encabezado encontrarPorId(Long id);
    List<Factura_Encabezado> encontrarPorCliente(Long clienteId);
    List<Factura_Encabezado> encontrarPorFechaEntre(LocalDate fechaInicio, LocalDate fechaFin);
    Double calcularTotalVentasPorPeriodo(LocalDate fechaInicio, LocalDate fechaFin);
    void guardar(Factura_Encabezado facturaEncabezado);
    void actualizar(Factura_Encabezado facturaEncabezado);
    void eliminar(Long id);
}