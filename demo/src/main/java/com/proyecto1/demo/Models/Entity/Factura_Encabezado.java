package com.proyecto1.demo.Models.Entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Entity
@Table(name = "factura_encabezado")
@Data
public class Factura_Encabezado implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long factura_id;

    @Column(name = "numero_factura", nullable = false, length = 50)
    private String numeroFactura;

    @Column(name = "fecha_emision", nullable = false)
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaEmision;

    @Column(name = "fecha_creacion", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime fechaCreacion;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "descuento", nullable = false, precision = 10, scale = 2)
    private BigDecimal descuento = BigDecimal.ZERO;

    @Column(name = "impuesto", nullable = false, precision = 10, scale = 2)
    private BigDecimal impuesto = BigDecimal.ZERO;

    @Column(name = "total", nullable = false, precision = 10, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    @Column(name = "estado", nullable = false, length = 20)
    private String estado = "PENDIENTE";

    @Column(name = "metodo_pago", length = 50)
    private String metodoPago;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", referencedColumnName = "cliente_id", nullable = false)
    private Cliente cliente;

    @OneToMany(mappedBy = "facturaEncabezado", fetch = FetchType.LAZY, cascade = jakarta.persistence.CascadeType.ALL)
    private List<Factura_Detalles> facturasDetalles;


    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
        if (fechaEmision == null) {
            fechaEmision = LocalDate.now();
        }
        calcularTotal();
    }

    /**
     * Calcula el total basado en subtotal, descuento e impuesto
     */
    public void calcularTotal() {
        if (subtotal != null && descuento != null && impuesto != null) {
            this.total = subtotal.subtract(descuento).add(impuesto);
        }
    }

    public Factura_Encabezado(){
        
    }

   
}
