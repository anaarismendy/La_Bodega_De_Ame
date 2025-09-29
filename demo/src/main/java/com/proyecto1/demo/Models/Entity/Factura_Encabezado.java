package com.proyecto1.demo.Models.Entity;

import java.io.Serializable;
import java.time.LocalDate;
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
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Table(name = "factura_encabezado")
@Data
@AllArgsConstructor
public class Factura_Encabezado implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long factura_id; 

    @Column(name = "fecha_emisión", nullable = false)
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaEmision;
    
    @Column(name = "total", nullable = false)
    private Double total;

    @ManyToOne
    @JoinColumn(name = "cliente_id", referencedColumnName = "cliente_id", nullable = false)
    private Cliente cliente;

    // Relación 1 a Muchos: Un cliente puede tener muchas facturas
    @OneToMany(mappedBy = "facturaEncabezado", fetch = FetchType.LAZY)
    private List<Factura_Detalles> facturasDetalles;

    public Factura_Encabezado() {}
}
