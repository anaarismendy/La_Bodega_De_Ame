package com.proyecto1.demo.Models.Entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Table(name = "factura_detalle")
@Data
@AllArgsConstructor
public class Factura_Detalles implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long detalle_id; 
    
    @Column(name = "Cantidad", nullable = false)
    private Long Cantidad;

    @Column(name = "Subtotal", nullable = false)
    private Double subtotal;

    // Relación ManyToOne CORREGIDA - ahora referencia "cliente_id"
    @ManyToOne
    @JoinColumn(name = "factura_id", referencedColumnName = "factura_id", nullable = false)
    private Factura_Encabezado facturaEncabezado;

    @OneToOne
    @JoinColumn(name = "producto_id", referencedColumnName = "producto_id", nullable = false)
    private Producto producto;

    // Constructor sin argumentos
    public Factura_Detalles() {}
}