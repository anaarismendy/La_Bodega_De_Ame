package com.proyecto1.demo.Models.Entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/**
 * Entidad Cliente que representa la tabla clientes en la base de datos
 * Implementa Serializable para compatibilidad con JPA
 */
@Entity
@Table(name = "clientes")
public class Cliente implements Serializable {
    
    @Id
    @Column(name = "cliente_id", length = 15, nullable = false)
    private String clienteId; // Cédula del cliente
    
    @Column(name = "nombre", length = 50, nullable = false)
    private String nombre;
    
    @Column(name = "\"Primer_Apellido\"", length = 50, nullable = false)
    private String primerApellido;
    
    @Column(name = "\"Segundo_Apellido\"", length = 50, nullable = false)
    private String segundoApellido;
    
    @Column(name = "email", length = 150, nullable = false, unique = true)
    private String email;
    
    @Column(name = "telefono")
    private Long telefono;
    
    @Column(name = "direccion", columnDefinition = "text")
    private String direccion;
    
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;
    
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
    
    @Column(name = "estado", length = 20)
    private String estado = "activo";

    // Relación OneToMany con Factura_Encabezado
    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    private List<Factura_Encabezado> facturas;

    // Constructores
    public Cliente() {}

    public Cliente(String clienteId, String nombre, String primerApellido, String segundoApellido, 
                   String email, Long telefono, String direccion, LocalDate fechaNacimiento, 
                   LocalDateTime fechaRegistro, String estado) {
        this.clienteId = clienteId;
        this.nombre = nombre;
        this.primerApellido = primerApellido;
        this.segundoApellido = segundoApellido;
        this.email = email;
        this.telefono = telefono;
        this.direccion = direccion;
        this.fechaNacimiento = fechaNacimiento;
        this.fechaRegistro = fechaRegistro;
        this.estado = estado;
    }

    // Getters y Setters
    public String getClienteId() {
        return clienteId;
    }

    public void setClienteId(String clienteId) {
        this.clienteId = clienteId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getPrimerApellido() {
        return primerApellido;
    }

    public void setPrimerApellido(String primerApellido) {
        this.primerApellido = primerApellido;
    }

    public String getSegundoApellido() {
        return segundoApellido;
    }

    public void setSegundoApellido(String segundoApellido) {
        this.segundoApellido = segundoApellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getTelefono() {
        return telefono;
    }

    public void setTelefono(Long telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public List<Factura_Encabezado> getFacturas() {
        return facturas;
    }

    public void setFacturas(List<Factura_Encabezado> facturas) {
        this.facturas = facturas;
    }

    @Override
    public String toString() {
        return "Cliente{" +
                "clienteId='" + clienteId + '\'' +
                ", nombre='" + nombre + '\'' +
                ", primerApellido='" + primerApellido + '\'' +
                ", segundoApellido='" + segundoApellido + '\'' +
                ", email='" + email + '\'' +
                ", telefono=" + telefono +
                ", direccion='" + direccion + '\'' +
                ", fechaNacimiento=" + fechaNacimiento +
                ", fechaRegistro=" + fechaRegistro +
                ", estado='" + estado + '\'' +
                '}';
    }
}
