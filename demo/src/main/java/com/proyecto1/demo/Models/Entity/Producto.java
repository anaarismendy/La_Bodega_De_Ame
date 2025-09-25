// package com.proyecto1.demo.Models.Entity;

// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.Table;

// @Entity
// @Table(name = "producto")
// public class Producto {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
//     private String nombre;
//     private Double precio;
//     private String descripcion;
//     private Integer cantidad;

//     // Constructor
//     public Producto(Long id, String nombre, Double precio, String descripcion, Integer cantidad) {
//         this.id = id;
//         this.nombre = nombre;
//         this.precio = precio;
//         this.descripcion = descripcion;
//         this.cantidad = cantidad;
//     }

//     public Producto() {
//     }

//     // Getters y Setters
//     public Long getId() {
//         return id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     public String getNombre() {
//         return nombre;
//     }

//     public void setNombre(String nombre) {
//         this.nombre = nombre;
//     }

//     public Double getPrecio() {
//         return precio;
//     }

//     public void setPrecio(Double precio) {
//         this.precio = precio;
//     }

//     public String getDescripcion() {
//         return descripcion;
//     }

//     public Integer getCantidad() {
//         return cantidad;
//     }

//     public void setDescripcion(String descripcion) {
//         this.descripcion = descripcion;
//     }

//     public void setCantidad(Integer cantidad) {
//         this.cantidad = cantidad;
//     }
// }
