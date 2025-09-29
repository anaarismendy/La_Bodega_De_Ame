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
    
}
