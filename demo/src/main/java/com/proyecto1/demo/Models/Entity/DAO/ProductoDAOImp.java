package com.proyecto1.demo.Models.Entity.DAO;

import com.proyecto1.demo.Models.Entity.Producto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class ProductoDAOImp implements ProductoDAO {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Producto> findAll() {
        return entityManager.createQuery("SELECT p FROM Producto p", Producto.class)
                .getResultList();
    }

    @Override
    public Producto findById(Long id) {
        return entityManager.find(Producto.class, id);
    }

    @Transactional
    @Override
    public void save(Producto producto) {
        entityManager.persist(producto);
    }

    @Transactional
    @Override
    public void update(long id, Producto producto) {
        if (producto == null) {
            throw new IllegalArgumentException("El producto no puede ser nulo");
        }

        Producto existente = findById(id);
        if (existente == null) {
            throw new IllegalArgumentException("No existe un producto con el id " + id);
        }

        producto.setId(id);
        entityManager.merge(producto);
    }

    @Transactional
    @Override
    public void delete(Long id) {
        Producto producto = findById(id);
        if (producto != null) {
            entityManager.remove(producto);
        }
    }
}
