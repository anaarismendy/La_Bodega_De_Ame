package com.proyecto1.demo.Models.Entity.DAO;

import com.proyecto1.demo.Models.Entity.Cliente;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class ClienteDAOImp implements ClienteDAO {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Cliente> findAll() {
        return entityManager.createQuery("SELECT c FROM Cliente c", Cliente.class)
                .getResultList();
    }

    @Override
    public Cliente findById(Long id) {
        return entityManager.find(Cliente.class, id);
    }

    @Transactional
    @Override
    public void save(Cliente cliente) {
        entityManager.persist(cliente);
    }

    @Transactional
    @Override
    public void update(Long id, Cliente cliente) {
        if (cliente == null) {
            throw new IllegalArgumentException("El cliente no puede ser nulo");
        }

        Cliente existente = findById(id);
        if (existente == null) {
            throw new IllegalArgumentException("No existe un cliente con el id " + id);
        }

        cliente.setId(id);
        entityManager.merge(cliente);
    }

    @Transactional
    @Override
    public void delete(Long id) {
        Cliente cliente = findById(id);
        if (cliente != null) {
            entityManager.remove(cliente);
        }
    }
}
