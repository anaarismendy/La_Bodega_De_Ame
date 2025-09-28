package com.proyecto1.demo.Models.Services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.proyecto1.demo.Models.Entity.Factura_Encabezado;
import com.proyecto1.demo.Models.Entity.Factura_Detalles;
import com.proyecto1.demo.Models.DAO.Factura_EncabezadoDAO;
import com.proyecto1.demo.Models.DAO.Factura_DetallesDAO;
import com.proyecto1.demo.Models.DAO.ProductoDAO;

@Service
public class FacturaService {
    
    @Autowired
    private Factura_EncabezadoDAO facturaEncabezadoDAO;
    
    @Autowired
    private Factura_DetallesDAO facturaDetallesDAO;
    
    @Autowired
    private ProductoDAO productoDAO;
    
    @Transactional
    public void procesarFacturaCompleta(Factura_Encabezado encabezado, List<Factura_Detalles> detalles) {
        // 1. Guardar el encabezado de la factura
        facturaEncabezadoDAO.guardar(encabezado);
        
        // 2. Guardar los detalles y actualizar stock
        for (Factura_Detalles detalle : detalles) {
            detalle.setFacturaEncabezado(encabezado);
            
            // Calcular subtotal si no está calculado
            if (detalle.getSubtotal() == null) {
                Double precioProducto = detalle.getProducto().getPrecio();
                Double subtotal = precioProducto * detalle.getCantidad();
                detalle.setSubtotal(subtotal);
            }
            
            facturaDetallesDAO.guardar(detalle);
            
            // Actualizar stock del producto (reducir cantidad vendida)
            productoDAO.actualizarStock(detalle.getProducto().getProducto_id(), -detalle.getCantidad());
        }
    }
}