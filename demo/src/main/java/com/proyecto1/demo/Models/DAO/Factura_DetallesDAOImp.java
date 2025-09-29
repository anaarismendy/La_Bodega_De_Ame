package com.proyecto1.demo.Models.DAO;

import java.util.List;
import org.springframework.stereotype.Repository;
import com.proyecto1.demo.Models.Entity.Factura_Detalles;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

@Repository
public class Factura_DetallesDAOImp implements Factura_DetallesDAO {
    
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Factura_Detalles> encontrarTodos() {
        return entityManager.createQuery("SELECT d FROM Factura_Detalles d ORDER BY d.detalle_id", Factura_Detalles.class)
                .getResultList();
    }

    @Override
    public Factura_Detalles encontrarPorId(Long id) {
        return entityManager.find(Factura_Detalles.class, id);
    }

    @Override
    public List<Factura_Detalles> encontrarPorFactura(Long facturaId) {
        TypedQuery<Factura_Detalles> query = entityManager.createQuery(
            "SELECT d FROM Factura_Detalles d WHERE d.facturaEncabezado.factura_id = :facturaId ORDER BY d.detalle_id", 
            Factura_Detalles.class);
        query.setParameter("facturaId", facturaId);
        return query.getResultList();
    }

    @Override
    public List<Factura_Detalles> encontrarPorProducto(Long productoId) {
        TypedQuery<Factura_Detalles> query = entityManager.createQuery(
            "SELECT d FROM Factura_Detalles d WHERE d.producto.producto_id = :productoId ORDER BY d.facturaEncabezado.fechaEmision DESC", 
            Factura_Detalles.class);
        query.setParameter("productoId", productoId);
        return query.getResultList();
    }

    @Transactional
    @Override
    public void guardar(Factura_Detalles facturaDetalle) {
        entityManager.persist(facturaDetalle);
    }

    @Transactional
    @Override
    public void guardarTodos(List<Factura_Detalles> detalles) {
        for (Factura_Detalles detalle : detalles) {
            entityManager.persist(detalle);
        }
    }

    @Transactional
    @Override
    public void actualizar(Factura_Detalles facturaDetalle) {
        entityManager.merge(facturaDetalle);
    }

    @Transactional
    @Override
    public void eliminar(Long id) {
        Factura_Detalles detalle = encontrarPorId(id);
        if (detalle != null) {
            entityManager.remove(detalle);
        }
    }

    @Transactional
    @Override
    public void eliminarPorFactura(Long facturaId) {
        List<Factura_Detalles> detalles = encontrarPorFactura(facturaId);
        for (Factura_Detalles detalle : detalles) {
            entityManager.remove(detalle);
        }
    }
}