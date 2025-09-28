 package com.proyecto1.demo.Models.Entity;

 import java.io.Serializable;

import jakarta.persistence.Column;
 import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
 import jakarta.persistence.GenerationType;
 import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;

 @Entity
 @Table(name = "Productos")
 @Data 
 @AllArgsConstructor
 public class Producto implements Serializable {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long producto_id;

     @Column(name = "nombre", nullable = false, length = 50)
     private String nombre;

     @Column(name = "precio", nullable = false)
     private Double precio;

     @Column(name = "precio_original", nullable = false)
     private Double precioOriginal;

     @Column(name = "descripcion", nullable = false, length = 100)
     private String descripcion;

     @Column(name = "imagen", nullable = true, length = 100)
     private String imagen;

     @Column(name = "hay_descuento", nullable = false)
     private Boolean hayDescuento;

     @Column(name = "stock", nullable = false)
     private Long stock; 
     
     @Column(name = "rating", nullable = true)
     private int rating;
     
     @Column(name = "descuento", nullable = true)
     private float descuento; // Descuento en porcentaje (0-100)

     @ManyToOne
    @JoinColumn(name = "categoria_id", referencedColumnName = "categoria_id", nullable = false)
    private Categoria categoria;


     /* 
     // Constructor
     public Producto(Long id, String nombre, Double precio, String descripcion, Integer cantidad) {
         this.id = id;
         this.nombre = nombre;
         this.precio = precio;
         this.descripcion = descripcion;
         this.cantidad = cantidad;
     }
    */

     public Producto() {
     }
/*
     // Getters y Setters
     public Long getId() {
         return id;
     }

     public void setId(Long id) {
         this.id = id;
     }

     public String getNombre() {
         return nombre;
     }

     public void setNombre(String nombre) {
         this.nombre = nombre;
     }

     public Double getPrecio() {
         return precio;
     }

     public void setPrecio(Double precio) {
         this.precio = precio;
     }

     public String getDescripcion() {
         return descripcion;
     }

     public Integer getCantidad() {
         return cantidad;
     } */

//     public void setDescripcion(String descripcion) {
//         this.descripcion = descripcion;
//     }

//     public void setCantidad(Integer cantidad) {
//         this.cantidad = cantidad;
//     }
 }
