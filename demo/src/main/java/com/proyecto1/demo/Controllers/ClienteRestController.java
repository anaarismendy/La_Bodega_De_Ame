package com.proyecto1.demo.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.proyecto1.demo.Models.Entity.Cliente;
import com.proyecto1.demo.Models.Entity.DAO.ClienteDAO;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Controlador REST para manejar operaciones de clientes
 * Implementa el patrón Repository para acceso a datos de clientes
 */
@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteRestController {

    @Autowired
    private ClienteDAO clienteDAO;



    /**
     * Obtiene todos los clientes de la base de datos
     * 
     * @return ResponseEntity con la lista de clientes o error 500
     */
    @GetMapping
    public ResponseEntity<List<Cliente>> getAllClientes() {
        try {
            List<Cliente> clientes = clienteDAO.findAll();
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtiene un cliente específico por su ID
     * 
     * @param clienteId ID del cliente a buscar
     * @return ResponseEntity con el cliente encontrado, 404 si no existe, o 500 si hay error
     */
    @GetMapping("/{clienteId}")
    public ResponseEntity<Cliente> getClienteById(@PathVariable String clienteId) {
        try {
            Cliente cliente = clienteDAO.findById(clienteId);
            if (cliente != null) {
                return ResponseEntity.ok(cliente);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Crea un nuevo cliente en la base de datos
     * 
     * @param cliente Cliente a crear (debe incluir la cédula como clienteId)
     * @return ResponseEntity con el cliente creado o error 400/500
     */
    @PostMapping
    public ResponseEntity<Cliente> createCliente(@RequestBody Cliente cliente) {
        try {
            // Validar que la cédula esté presente
            if (cliente.getClienteId() == null || cliente.getClienteId().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            // Validar formato de cédula (al menos 8 caracteres como indica la BD)
            String cedula = cliente.getClienteId().trim();
            if (cedula.length() < 8) {
                return ResponseEntity.badRequest().build();
            }
            
            // Verificar si ya existe un cliente con esa cédula
            Cliente clienteExistente = clienteDAO.findById(cedula);
            if (clienteExistente != null) {
                return ResponseEntity.badRequest().build(); // Cédula ya existe
            }
            
            // Establecer fecha de registro
            if (cliente.getFechaRegistro() == null) {
                cliente.setFechaRegistro(LocalDateTime.now());
            }
            
            // Establecer estado por defecto
            if (cliente.getEstado() == null || cliente.getEstado().isEmpty()) {
                cliente.setEstado("activo");
            }
            
            clienteDAO.save(cliente);
            return ResponseEntity.ok(cliente);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Actualiza un cliente existente en la base de datos
     * 
     * @param clienteId ID del cliente a actualizar
     * @param cliente Datos actualizados del cliente
     * @return ResponseEntity con el cliente actualizado, 404 si no existe, o 500 si hay error
     */
    @PutMapping("/{clienteId}")
    public ResponseEntity<Cliente> updateCliente(@PathVariable String clienteId, @RequestBody Cliente cliente) {
        try {
            Cliente clienteExistente = clienteDAO.findById(clienteId);
            if (clienteExistente != null) {
                clienteDAO.update(clienteId, cliente);
                return ResponseEntity.ok(cliente);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Elimina un cliente de la base de datos
     * 
     * @param clienteId ID del cliente a eliminar
     * @return ResponseEntity 200 si se elimina correctamente, 404 si no existe, o 500 si hay error
     */
    @DeleteMapping("/{clienteId}")
    public ResponseEntity<Void> deleteCliente(@PathVariable String clienteId) {
        try {
            Cliente cliente = clienteDAO.findById(clienteId);
            if (cliente != null) {
                clienteDAO.delete(clienteId);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
