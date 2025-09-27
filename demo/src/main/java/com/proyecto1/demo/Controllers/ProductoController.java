package com.proyecto1.demo.Controllers;

import com.proyecto1.demo.Models.Entity.DAO.ProductoDAO;
import com.proyecto1.demo.Models.Entity.Producto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private ProductoDAO productoDAO;

    // ====== LISTAR ======
    @GetMapping
    public String listarProductos(Model model) {
        model.addAttribute("productos", productoDAO.findAll());
        return "productos/list"; // Vista con la tabla/listado de productos
    }

    // ====== CREAR ======
    @GetMapping("/nuevo")
    public String mostrarFormularioNuevo(Model model) {
        model.addAttribute("producto", new Producto());
        return "productos/form"; // Vista con el formulario de creación
    }

    @PostMapping("/guardar")
    public String guardarProducto(@ModelAttribute("producto") Producto producto) {
        productoDAO.save(producto);
        return "redirect:/productos";
    }

    // ====== EDITAR ======
    @GetMapping("/editar/{productoId}")
    public String mostrarFormularioEditar(@PathVariable("productoId") Long productoId, Model model) {
        model.addAttribute("producto", productoDAO.findById(productoId));
        return "productos/form"; // Reutilizamos la misma vista de formulario
    }

    @PostMapping("/actualizar/{productoId}")
    public String actualizarProducto(@PathVariable("productoId") Long productoId,
                                     @ModelAttribute("producto") Producto producto) {
        productoDAO.update(productoId, producto);
        return "redirect:/productos";
    }

    // ====== ELIMINAR ======
    @GetMapping("/eliminar/{productoId}")
    public String eliminarProducto(@PathVariable("productoId") Long productoId) {
        productoDAO.delete(productoId);
        return "redirect:/productos";
    }
}


