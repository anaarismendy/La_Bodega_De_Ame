package com.proyecto1.demo.Models.DAO;

import java.util.List;
import org.springframework.stereotype.Repository;
import com.proyecto1.demo.Models.Entity.Categoria;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Repository
public class CategoriaDAOImp implements CategoriaDAO {
    
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Categoria> encontrarTodos() {
        return entityManager.createQuery("SELECT c FROM Categoria c ORDER BY c.nombre", Categoria.class)
                .getResultList();
    }

    @Override
    public Categoria encontrarPorId(Long id) {
        return entityManager.find(Categoria.class, id);
    }

    @Transactional
    @Override
    public void guardar(Categoria categoria) {
        entityManager.persist(categoria);
    }

    @Transactional
    @Override
    public void actualizar(Categoria categoria) {
        entityManager.merge(categoria);
    }

    @Transactional
    @Override
    public void eliminar(Long id) {
        Categoria categoria = encontrarPorId(id);
        if (categoria != null) {
            entityManager.remove(categoria);
        }
    }
}