package com.proyecto1.demo.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.proyecto1.demo.Models.Entity.DAO.ProductoDAO;
import com.proyecto1.demo.Models.Entity.Producto;

@Controller
@RequestMapping("/productos")
public class ProductoController {
	@Autowired
	private ProductoDAO productoDAO;

	@GetMapping
	public String getAllProducts(Model model) {
		model.addAttribute("productos", productoDAO.findAll());
		return "productos/list";
	}

	@GetMapping("/new-product")
	public String getNewProductForm(Model model) {
		model.addAttribute("producto", new Producto());
		return "productos/form";
	}

	@PostMapping("/save")
	public String saveProduct(@ModelAttribute("producto") Producto producto) {
		productoDAO.save(producto);
		return "redirect:/productos";
	}

	@GetMapping("/edit/{id}")
	public String getEditProductForm(@PathVariable Long id, Model model) {
		model.addAttribute("producto", productoDAO.findById(id));
		return "productos/form";
	}

	@PostMapping("/update/{id}")
	public String updateProduct(@PathVariable Long id, @ModelAttribute("producto") Producto producto) {
		productoDAO.update(id, producto);
		return "redirect:/productos";
	}

	@GetMapping("/delete/{id}")
	public String deleteProduct(@PathVariable Long id) {
		productoDAO.delete(id);
		return "redirect:/productos";
	}
}

