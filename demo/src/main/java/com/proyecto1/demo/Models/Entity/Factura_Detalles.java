package com.proyecto1.demo.Models.Entity;

import java.io.Serializable;
import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "factura_detalle")
@Data
public class Factura_Detalles implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long detalle_id;
    
    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(name = "descuento", nullable = false, precision = 10, scale = 2)
    private BigDecimal descuento = BigDecimal.ZERO;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    // Relación ManyToOne con Factura_Encabezado
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "factura_id", referencedColumnName = "factura_id", nullable = false)
    private Factura_Encabezado facturaEncabezado;

    @Column(name = "numero_factura", length = 50)
    private String numeroFactura;

    // Relación ManyToOne con Producto (CORREGIDO: era OneToOne)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", referencedColumnName = "producto_id", nullable = false)
    private Producto producto;

    /**
     * Calcula el subtotal automáticamente antes de persistir o actualizar
     */
    @PrePersist
    @PreUpdate
    public void calcularSubtotal() {
        if (cantidad != null && precioUnitario != null && descuento != null) {
            BigDecimal totalSinDescuento = precioUnitario.multiply(new BigDecimal(cantidad));
            this.subtotal = totalSinDescuento.subtract(descuento);
        }
    }

    /**
     * Constructor con parámetros para facilitar la creación
     */
    public Factura_Detalles(Integer cantidad, BigDecimal precioUnitario, 
                           BigDecimal descuento, Factura_Encabezado facturaEncabezado, 
                           Producto producto) {
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.descuento = descuento != null ? descuento : BigDecimal.ZERO;
        this.facturaEncabezado = facturaEncabezado;
        this.numeroFactura = facturaEncabezado.getNumeroFactura();
        this.producto = producto;
        calcularSubtotal();
    }

    public Factura_Detalles() {}

    
}