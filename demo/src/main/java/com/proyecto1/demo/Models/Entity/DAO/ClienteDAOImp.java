package com.proyecto1.demo.Models.Entity.DAO;

import com.proyecto1.demo.Models.Entity.Cliente;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Implementación del DAO para operaciones de clientes
 * Maneja todas las operaciones de base de datos relacionadas con la entidad Cliente
 */
@Repository
public class ClienteDAOImp implements ClienteDAO {
    
    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Obtiene todos los clientes de la base de datos
     * 
     * @return Lista de todos los clientes
     */
    @Override
    public List<Cliente> findAll() {
        return entityManager.createQuery("SELECT c FROM Cliente c", Cliente.class)
                .getResultList();
    }

    /**
     * Busca un cliente por su ID
     * 
     * @param clienteId ID del cliente (String)
     * @return Cliente encontrado o null
     */
    @Override
    public Cliente findById(String clienteId) {
        return entityManager.find(Cliente.class, clienteId);
    }
    
    /**
     * Guarda un nuevo cliente en la base de datos
     * 
     * @param cliente Cliente a guardar
     */
    @Transactional
    @Override
    public void save(Cliente cliente) {
        entityManager.persist(cliente);
    }

    /**
     * Actualiza un cliente existente
     * 
     * @param clienteId ID del cliente a actualizar
     * @param cliente Datos actualizados del cliente
     */
    @Transactional
    @Override
    public void update(String clienteId, Cliente cliente) {
        cliente.setClienteId(clienteId);
        entityManager.merge(cliente);
    }

    /**
     * Elimina un cliente de la base de datos
     * 
     * @param clienteId ID del cliente a eliminar
     */
    @Transactional
    @Override
    public void delete(String clienteId) {
        Cliente cliente = findById(clienteId);
        if (cliente != null) {
            entityManager.remove(cliente);
        }
    }
}
