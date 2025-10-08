package com.proyecto1.demo.Controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.proyecto1.demo.Models.DAO.Factura_EncabezadoDAO;
import com.proyecto1.demo.Models.Entity.Factura_Encabezado;

/**
 * Controlador para manejar las vistas HTML de las facturas
 * Separado del controlador REST para evitar conflictos de mapeo
 */
@Controller
public class FacturaViewController {

    private static final Logger logger = LoggerFactory.getLogger(FacturaViewController.class);

    @Autowired
    private Factura_EncabezadoDAO facturaEncabezadoDAO;

    /**
     * Endpoint de prueba para verificar que el mapeo funcione
     * GET /factura/test
     */
    @GetMapping("/factura/test")
    public String testFactura(Model model) {
        logger.info("Endpoint de prueba de factura accedido");
        model.addAttribute("error", "Endpoint de prueba funcionando correctamente");
        return "error";
    }

    /**
     * Muestra una factura por ID con todos sus detalles
     * GET /factura/{facturaId}
     */
    @GetMapping("/factura/{facturaId}")
    public String mostrarFactura(@PathVariable Long facturaId, Model model) {
        logger.info("Solicitando mostrar factura con ID: {}", facturaId);
        
        try {
            Factura_Encabezado factura = facturaEncabezadoDAO.encontrarPorId(facturaId);
            if (factura != null) {
                logger.info("Factura encontrada: {}", factura.getNumeroFactura());
                
                // Agregar todos los datos necesarios para el template
                model.addAttribute("encabezado", factura);
                model.addAttribute("factura", factura);
                model.addAttribute("cliente", factura.getCliente());
                model.addAttribute("detalles", factura.getFacturasDetalles());
                
                // Agregar datos adicionales que el template puede necesitar
                model.addAttribute("fecha", factura.getFechaEmision());
                model.addAttribute("numeroFactura", factura.getNumeroFactura());
                model.addAttribute("estado", factura.getEstado());
                model.addAttribute("subtotal", factura.getSubtotal());
                model.addAttribute("descuento", factura.getDescuento());
                model.addAttribute("impuesto", factura.getImpuesto());
                model.addAttribute("total", factura.getTotal());
                model.addAttribute("metodoPago", factura.getMetodoPago());
                model.addAttribute("observaciones", factura.getObservaciones());
                
                return "factura";
            } else {
                logger.warn("Factura no encontrada con ID: {}", facturaId);
                model.addAttribute("error", "Factura no encontrada");
                return "error";
            }
        } catch (Exception e) {
            logger.error("Error al cargar factura {}: {}", facturaId, e.getMessage(), e);
            model.addAttribute("error", "Error al cargar la factura: " + e.getMessage());
            return "error";
        }
    }
}
