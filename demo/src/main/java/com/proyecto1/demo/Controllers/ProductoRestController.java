package com.proyecto1.demo.Controllers;

import com.proyecto1.demo.Models.DAO.ProductoDAO;
import com.proyecto1.demo.Models.Entity.Producto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // Para permitir CORS desde el frontend
public class ProductoRestController {

    @Autowired
    private ProductoDAO productoDAO;

    /**
     * Obtiene todos los productos disponibles en la base de datos
     * Implementa el patrón Repository para acceso a datos
     * 
     * @return ResponseEntity con la lista de productos o error 500
     */
    @GetMapping
    public ResponseEntity<List<Producto>> getAllProductos() {
        try {
            List<Producto> productos = productoDAO.findAll();
            return ResponseEntity.ok(productos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtiene un producto específico por su ID
     * 
     * @param id ID del producto a buscar
     * @return ResponseEntity con el producto encontrado, 404 si no existe, o 500 si
     *         hay error
     */
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        try {
            Producto producto = productoDAO.findById(id);
            if (producto != null) {
                return ResponseEntity.ok(producto);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Crea un nuevo producto en la base de datos
     * 
     * @param producto Producto a crear
     * @return ResponseEntity con el producto creado o error 500
     */
    @PostMapping
    public ResponseEntity<Producto> createProducto(@RequestBody Producto producto) {
        try {
            productoDAO.save(producto);
            return ResponseEntity.ok(producto);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Actualiza un producto existente en la base de datos
     * 
     * @param id       ID del producto a actualizar
     * @param producto Datos actualizados del producto
     * @return ResponseEntity con el producto actualizado, 404 si no existe, o 500
     *         si hay error
     */
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody Producto producto) {
        try {
            Producto productoExistente = productoDAO.findById(id);
            if (productoExistente != null) {
                producto.setProductoId(id);
                productoDAO.update(id, producto);
                return ResponseEntity.ok(producto);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Elimina un producto de la base de datos
     * 
     * @param id ID del producto a eliminar
     * @return ResponseEntity 200 si se elimina correctamente, 404 si no existe, o
     *         500 si hay error
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        try {
            Producto producto = productoDAO.findById(id);
            if (producto != null) {
                productoDAO.delete(id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
