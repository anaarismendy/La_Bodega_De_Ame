package com.proyecto1.demo.Models.Entity.DAO;

import com.proyecto1.demo.Models.Entity.Carrito;
import java.util.List;

/**
 * Interfaz DAO para operaciones del carrito de compras
 * Define los métodos de acceso a datos para la entidad Carrito
 */
public interface CarritoDAO {

    /**
     * Guarda un item del carrito en la base de datos
     * 
     * @param carrito Item del carrito a guardar
     */
    void save(Carrito carrito);

    /**
     * Busca un item del carrito por su ID
     * 
     * @param id ID del item del carrito
     * @return Item del carrito encontrado o null
     */
    Carrito findById(Long id);

    /**
     * Obtiene todos los items del carrito de un cliente específico
     * 
     * @param clienteId ID del cliente (String)
     * @return Lista de items del carrito del cliente
     */
    List<Carrito> findByClienteId(String clienteId);

    /**
     * Elimina un item del carrito por su ID
     * 
     * @param id ID del item del carrito a eliminar
     */
    void delete(Long id);

    /**
     * Elimina todos los items del carrito de un cliente específico
     * 
     * @param clienteId ID del cliente (String)
     */
    void deleteByClienteId(String clienteId);
} 
