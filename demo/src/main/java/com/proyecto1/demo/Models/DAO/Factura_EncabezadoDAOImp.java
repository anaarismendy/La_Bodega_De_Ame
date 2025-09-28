package com.proyecto1.demo.Models.DAO;

import java.util.List;
import java.time.LocalDate;
import org.springframework.stereotype.Repository;
import com.proyecto1.demo.Models.Entity.Factura_Encabezado;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

@Repository
public class Factura_EncabezadoDAOImp implements Factura_EncabezadoDAO {
    
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Factura_Encabezado> encontrarTodos() {
        return entityManager.createQuery(
            "SELECT f FROM Factura_Encabezado f ORDER BY f.fechaEmision DESC", Factura_Encabezado.class)
                .getResultList();
    }

    @Override
    public Factura_Encabezado encontrarPorId(Long id) {
        return entityManager.find(Factura_Encabezado.class, id);
    }

    @Override
    public List<Factura_Encabezado> encontrarPorCliente(Long clienteId) {
        TypedQuery<Factura_Encabezado> query = entityManager.createQuery(
            "SELECT f FROM Factura_Encabezado f WHERE f.cliente.cliente_id = :clienteId ORDER BY f.fechaEmision DESC", 
            Factura_Encabezado.class);
        query.setParameter("clienteId", clienteId);
        return query.getResultList();
    }

    @Override
    public List<Factura_Encabezado> encontrarPorFechaEntre(LocalDate fechaInicio, LocalDate fechaFin) {
        TypedQuery<Factura_Encabezado> query = entityManager.createQuery(
            "SELECT f FROM Factura_Encabezado f WHERE f.fechaEmision BETWEEN :fechaInicio AND :fechaFin ORDER BY f.fechaEmision", 
            Factura_Encabezado.class);
        query.setParameter("fechaInicio", fechaInicio);
        query.setParameter("fechaFin", fechaFin);
        return query.getResultList();
    }

    @Override
    public Double calcularTotalVentasPorPeriodo(LocalDate fechaInicio, LocalDate fechaFin) {
        TypedQuery<Double> query = entityManager.createQuery(
            "SELECT SUM(f.total) FROM Factura_Encabezado f WHERE f.fechaEmision BETWEEN :fechaInicio AND :fechaFin", 
            Double.class);
        query.setParameter("fechaInicio", fechaInicio);
        query.setParameter("fechaFin", fechaFin);
        Double resultado = query.getSingleResult();
        return resultado != null ? resultado : 0.0;
    }

    @Transactional
    @Override
    public void guardar(Factura_Encabezado facturaEncabezado) {
        entityManager.persist(facturaEncabezado);
    }

    @Transactional
    @Override
    public void actualizar(Factura_Encabezado facturaEncabezado) {
        entityManager.merge(facturaEncabezado);
    }

    @Transactional
    @Override
    public void eliminar(Long id) {
        Factura_Encabezado factura = encontrarPorId(id);
        if (factura != null) {
            entityManager.remove(factura);
        }
    }
}