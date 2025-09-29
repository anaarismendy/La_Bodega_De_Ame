package com.proyecto1.demo.Models.DAO;

import com.proyecto1.demo.Models.Entity.Cliente;
import java.util.List;

/**
 * Interfaz DAO para operaciones de clientes
 * Define los métodos de acceso a datos para la entidad Cliente
 */
public interface ClienteDAO {
    
    /**
     * Obtiene todos los clientes de la base de datos
     * 
     * @return Lista de todos los clientes
     */
    List<Cliente> findAll();
    
    /**
     * Busca un cliente por su ID
     * 
     * @param clienteId ID del cliente (String)
     * @return Cliente encontrado o null
     */
    Cliente findById(String clienteId);
    
    /**
     * Guarda un nuevo cliente en la base de datos
     * 
     * @param cliente Cliente a guardar
     */
    void save(Cliente cliente);
    
    /**
     * Actualiza un cliente existente
     * 
     * @param clienteId ID del cliente a actualizar
     * @param cliente Datos actualizados del cliente
     */
    void update(String clienteId, Cliente cliente);
    
    /**
     * Elimina un cliente de la base de datos
     * 
     * @param clienteId ID del cliente a eliminar
     */
    void delete(String clienteId);
}


