package com.proyecto1.demo.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyecto1.demo.Models.DAO.CarritoDAO;
import com.proyecto1.demo.Models.DAO.ClienteDAO;
import com.proyecto1.demo.Models.DAO.ProductoDAO;
import com.proyecto1.demo.Models.Entity.Carrito;
import com.proyecto1.demo.Models.Entity.Cliente;
import com.proyecto1.demo.Models.Entity.Producto;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST para manejar operaciones del carrito de compras
 * Implementa el patrón Repository para acceso a datos del carrito
 */
@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "*")
public class CarritoController {

    @Autowired
    private CarritoDAO carritoDAO;
    
    @Autowired
    private ClienteDAO clienteDAO;
    
    @Autowired
    private ProductoDAO productoDAO;

    /**
     * Guarda un item del carrito en la base de datos
     * 
     * @param carrito Item del carrito a guardar
     * @return ResponseEntity con el carrito guardado o error 500
     */
    @PostMapping
    public ResponseEntity<Carrito> saveCarritoItem(@RequestBody Carrito carrito) {
        try {
            carritoDAO.save(carrito);
            return ResponseEntity.ok(carrito);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Guarda múltiples items del carrito (para checkout completo)
     * 
     * @param carritoItems Lista de mapas con los datos del carrito a guardar
     * @return ResponseEntity con la lista guardada o error 500
     */
    @PostMapping("/checkout")
    public ResponseEntity<List<Carrito>> saveCartCheckout(@RequestBody List<Map<String, Object>> carritoItems) {
        try {
            List<Carrito> carritosGuardados = new java.util.ArrayList<>();
            
            for (Map<String, Object> item : carritoItems) {
                // Extraer datos del mapa
                String clienteId = item.get("clienteId").toString();
                Long productoId = Long.valueOf(item.get("productoId").toString());
                Integer cantidad = Integer.valueOf(item.get("cantidad").toString());
                
                // Buscar el cliente
                Cliente cliente = clienteDAO.findById(clienteId);
                if (cliente == null) {
                    return ResponseEntity.badRequest().build(); // Cliente no encontrado
                }
                
                // Buscar el producto
                Producto producto = productoDAO.findById(productoId);
                if (producto == null) {
                    return ResponseEntity.badRequest().build(); // Producto no encontrado
                }
                
                // Crear el objeto Carrito
                Carrito carrito = new Carrito();
                carrito.setCliente(cliente);
                carrito.setProducto(producto);
                carrito.setCantidad(cantidad);
                
                // Guardar en la base de datos
                carritoDAO.save(carrito);
                carritosGuardados.add(carrito);
            }
            
            return ResponseEntity.ok(carritosGuardados);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtiene todos los items del carrito de un cliente
     * 
     * @param clienteId ID del cliente (String)
     * @return ResponseEntity con la lista de items del carrito
     */
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Carrito>> getCarritoByCliente(@PathVariable String clienteId) {
        try {
            List<Carrito> carritoItems = carritoDAO.findByClienteId(clienteId);
            return ResponseEntity.ok(carritoItems);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Elimina un item del carrito
     * 
     * @param id ID del item del carrito a eliminar
     * @return ResponseEntity 200 si se elimina correctamente o error 500
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCarritoItem(@PathVariable Long id) {
        try {
            carritoDAO.delete(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Limpia el carrito de un cliente (elimina todos sus items)
     * 
     * @param clienteId ID del cliente (String)
     * @return ResponseEntity 200 si se limpia correctamente o error 500
     */
    @DeleteMapping("/cliente/{clienteId}")
    public ResponseEntity<Void> clearCarritoByCliente(@PathVariable String clienteId) {
        try {
            carritoDAO.deleteByClienteId(clienteId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
