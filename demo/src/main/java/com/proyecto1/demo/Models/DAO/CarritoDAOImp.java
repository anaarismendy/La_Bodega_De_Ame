package com.proyecto1.demo.Models.DAO;

import org.springframework.stereotype.Repository;

import com.proyecto1.demo.Models.Entity.Carrito;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;

/**
 * Implementación del DAO para operaciones del carrito de compras
 * Maneja todas las operaciones de base de datos relacionadas con la entidad Carrito
 */
@Repository
public class CarritoDAOImp implements CarritoDAO {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Guarda un item del carrito en la base de datos
     * 
     * @param carrito Item del carrito a guardar
     */
    @Transactional
    @Override
    public void save(Carrito carrito) {
        entityManager.persist(carrito);
    }

    /**
     * Busca un item del carrito por su ID
     * 
     * @param id ID del item del carrito
     * @return Item del carrito encontrado o null
     */
    @Override
    public Carrito findById(Long id) {
        return entityManager.find(Carrito.class, id);
    }

    /**
     * Obtiene todos los items del carrito de un cliente específico
     * 
     * @param clienteId ID del cliente (String)
     * @return Lista de items del carrito del cliente
     */
    @Override
    public List<Carrito> findByClienteId(String clienteId) {
        return entityManager.createQuery(
            "SELECT c FROM Carrito c WHERE c.cliente.clienteId = :clienteId", 
            Carrito.class
        ).setParameter("clienteId", clienteId).getResultList();
    }

    /**
     * Elimina un item del carrito por su ID
     * 
     * @param id ID del item del carrito a eliminar
     */
    @Transactional
    @Override
    public void delete(Long id) {
        Carrito carrito = findById(id);
        if (carrito != null) {
            entityManager.remove(carrito);
        }
    }

    /**
     * Elimina todos los items del carrito de un cliente específico
     * 
     * @param clienteId ID del cliente (String)
     */
    @Transactional
    @Override
    public void deleteByClienteId(String clienteId) {
        entityManager.createQuery(
            "DELETE FROM Carrito c WHERE c.cliente.clienteId = :clienteId"
        ).setParameter("clienteId", clienteId).executeUpdate();
    }
}
