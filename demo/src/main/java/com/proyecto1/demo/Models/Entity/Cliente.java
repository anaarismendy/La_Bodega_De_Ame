package com.proyecto1.demo.Models.Entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;
import jakarta.persistence.FetchType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Table(name = "Clientes")
@Data // Genera getters, setters, toString, equals y hashCode automáticamente
@AllArgsConstructor // Genera un constructor con todos los campos como parámetros
public class Cliente implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cliente_id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "apellido_1")
    private String apellido_1;

    @Column(name = "apellido_2")
    private String apellido_2;

    @Column(name = "email")
    private String email;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "fecha_nacimiento")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaNacimiento;

    @Column(name = "fecha_registro")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaRegistro;

    @Column(name = "estado")
    private Boolean estado;

    // Relación 1 a Muchos: Un cliente puede tener muchas facturas
    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    private List<Factura_Encabezado> facturas;

    public Cliente() {};
}
