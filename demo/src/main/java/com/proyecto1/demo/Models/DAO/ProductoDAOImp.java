/*package com.proyecto1.demo.Models.DAO;

 import java.util.List;

 import org.springframework.stereotype.Repository;

 import com.proyecto1.demo.Models.Entity.Producto;

 import jakarta.persistence.EntityManager;
 import jakarta.persistence.PersistenceContext;
 import jakarta.transaction.Transactional;

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
*/
package com.proyecto1.demo.Models.DAO;

import java.util.List;
import org.springframework.stereotype.Repository;
import com.proyecto1.demo.Models.Entity.Producto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

@Repository
public class ProductoDAOImp implements ProductoDAO {
    
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Producto> encontrarTodos() {
        return entityManager.createQuery("SELECT p FROM Producto p ORDER BY p.nombre", Producto.class)
                .getResultList();
    }

    @Override
    public Producto encontrarPorId(Long id) {
        return entityManager.find(Producto.class, id);
    }

    @Override
    public List<Producto> encontrarPorCategoria(Long categoriaId) {
        TypedQuery<Producto> query = entityManager.createQuery(
            "SELECT p FROM Producto p WHERE p.categoria.categoria_id = :categoriaId ORDER BY p.nombre", Producto.class);
        query.setParameter("categoriaId", categoriaId);
        return query.getResultList();
    }

    @Override
    public List<Producto> encontrarConDescuento() {
        TypedQuery<Producto> query = entityManager.createQuery(
            "SELECT p FROM Producto p WHERE p.hayDescuento = true ORDER BY p.descuento DESC", Producto.class);
        return query.getResultList();
    }

    @Override
    public List<Producto> encontrarPorRangoPrecio(Double precioMinimo, Double precioMaximo) {
        TypedQuery<Producto> query = entityManager.createQuery(
            "SELECT p FROM Producto p WHERE p.precio BETWEEN :precioMinimo AND :precioMaximo ORDER BY p.precio", Producto.class);
        query.setParameter("precioMinimo", precioMinimo);
        query.setParameter("precioMaximo", precioMaximo);
        return query.getResultList();
    }

    @Transactional
    @Override
    public void guardar(Producto producto) {
        entityManager.persist(producto);
    }

    @Transactional
    @Override
    public void actualizar(Producto producto) {
        entityManager.merge(producto);
    }

    @Transactional
    @Override
    public void eliminar(Long id) {
        Producto producto = encontrarPorId(id);
        if (producto != null) {
            entityManager.remove(producto);
        }
    }

    @Transactional
    @Override
    public void actualizarStock(Long productoId, Long cantidad) {
        Producto producto = encontrarPorId(productoId);
        if (producto != null) {
            Long nuevoStock = producto.getStock() + cantidad;
            if (nuevoStock < 0) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }
            producto.setStock(nuevoStock);
            entityManager.merge(producto);
        }
    }
}