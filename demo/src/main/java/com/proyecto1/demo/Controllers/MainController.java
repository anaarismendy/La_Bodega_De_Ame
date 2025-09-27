package com.proyecto1.demo.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.proyecto1.demo.Models.Entity.DAO.ProductoDAO;

@Controller
public class MainController {

    private final ProductoDAO productoDAO;

    public MainController(ProductoDAO productoDAO) {
        this.productoDAO = productoDAO;
    }

    @GetMapping("/")
    public String index(Model model) {
        loadProductos(model);
        return "index";
    }
    
    @GetMapping("/index")
    public String indexPage(Model model) {
        loadProductos(model);
        return "index";
    }

    private void loadProductos(Model model) {
        model.addAttribute("productos", productoDAO.findAll());
    }
}
