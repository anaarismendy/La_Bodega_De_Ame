package com.proyecto1.demo.Models.Entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Table(name = "categoria")
@Data
@AllArgsConstructor
public class Categoria implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoria_id; 

    @Column(name = "nombre", nullable = false)
    private String nombre;

    /*// Relación 1 a Muchos: Un categoría puede tener muchos productos
    @OneToMany(mappedBy = "categoria", fetch = FetchType.LAZY)
    private List<Producto> productos;*/

    // Constructor sin argumentos
    public Categoria() {}

    // Getters y Setters
    public Long getCategoria_id() {
        return categoria_id;
    }

    public void setCategoria_id(Long categoria_id) {
        this.categoria_id = categoria_id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}