package com.proyecto1.demo.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Controlador principal para manejar las vistas de la aplicación
 * Implementa el patrón MVC para renderizado de templates Thymeleaf
 */
@Controller
public class MainController {

    /**
     * Maneja la ruta raíz de la aplicación
     * 
     * @return Nombre del template index
     */
    @GetMapping("/")
    public String index() {
        return "index";
    }
    
    /**
     * Maneja la ruta alternativa del índice
     * 
     * @return Nombre del template index
     */
    @GetMapping("/index")
    public String indexPage() {
        return "index";
    }
    
    /**
     * Maneja la página de detalle del producto
     * 
     * @param id ID del producto (opcional)
     * @return Nombre del template item_detail
     */
    @GetMapping("/item_detail")
    public String itemDetail(@RequestParam(required = false) String id) {
        return "item_detail";
    }
    
    /**
     * Maneja la página de factura
     * 
     * NOTA: Para inyección completa de datos, este método debe ser modificado para:
     * 1. Recibir parámetros de consulta (ej: ?id=123&clienteId=456)
     * 2. Buscar el encabezado de factura desde la base de datos
     * 3. Buscar los detalles de factura asociados
     * 4. Pasar ambos objetos al modelo:
     *    - model.addAttribute("encabezado", encabezadoFactura);
     *    - model.addAttribute("detalles", listaDetallesFactura);
     * 
     * Estructura esperada del encabezado:
     * - numeroFactura, fecha, estado
     * - cliente (con: clienteId, nombre, primerApellido, segundoApellido, email, telefono, direccion)
     * - empresa (con: nombre, descripcion, direccion, telefono, email, emailSoporte)
     * - subtotal, iva, porcentajeIva, descuentoTotal, total
     * - metodoPago, tiempoEntrega, politicaDevolucion
     * 
     * Estructura esperada de cada detalle:
     * - cantidad, precioUnitario, descuento, subtotal
     * - producto (con: nombre, categoria, imagen)
     * 
     * @return Nombre del template factura
     */
    @GetMapping("/factura")
    public String factura() {
        return "factura";
    }
    
}
