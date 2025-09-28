/*package com.proyecto1.demo.Models.DAO;

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
       return entityManager.createQuery("SELECT c FROM Cliente c", Cliente.class)               .getResultList();
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
 }*/

 package com.proyecto1.demo.Models.DAO;

import java.util.List;
import org.springframework.stereotype.Repository;
import com.proyecto1.demo.Models.Entity.Cliente;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

@Repository
public class ClienteDAOImp implements ClienteDAO {
    
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Cliente> encontrarTodos() {
        return entityManager.createQuery("SELECT c FROM Cliente c ORDER BY c.nombre, c.apellido_1", Cliente.class)
                .getResultList();
    }

    @Override
    public Cliente encontrarPorId(Long id) {
        return entityManager.find(Cliente.class, id);
    }

    @Override
    public Cliente encontrarPorEmail(String email) {
        TypedQuery<Cliente> query = entityManager.createQuery(
            "SELECT c FROM Cliente c WHERE c.email = :email", Cliente.class);
        query.setParameter("email", email);
        return query.getResultStream().findFirst().orElse(null);
    }

    @Override
    public List<Cliente> encontrarPorEstado(Boolean estado) {
        TypedQuery<Cliente> query = entityManager.createQuery(
            "SELECT c FROM Cliente c WHERE c.estado = :estado ORDER BY c.nombre", Cliente.class);
        query.setParameter("estado", estado);
        return query.getResultList();
    }

    @Transactional
    @Override
    public void guardar(Cliente cliente) {
        entityManager.persist(cliente);
    }

    @Transactional
    @Override
    public void actualizar(Cliente cliente) {
        entityManager.merge(cliente);
    }

    @Transactional
    @Override
    public void eliminar(Long id) {
        Cliente cliente = encontrarPorId(id);
        if (cliente != null) {
            entityManager.remove(cliente);
        }
    }
}