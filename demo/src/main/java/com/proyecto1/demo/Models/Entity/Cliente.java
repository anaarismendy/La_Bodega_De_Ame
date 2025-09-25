// package com.proyecto1.demo.Models.Entity;

// import java.io.Serializable;

// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.Table;

// @Entity
// @Table(name = "cliente")
// public class Cliente implements Serializable{
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
//     private String nombre;
//     private String email;
//     private String apellido;
//     @Column(name = "fecha_nacimiento")
//     private String fechaNacimiento;

//     // Constructor
//     public Cliente(Long id, String nombre, String email, String apellido, String fechaNacimiento) {
//         this.id = id;
//         this.nombre = nombre;
//         this.email = email;
//         this.apellido = apellido;
//         this.fechaNacimiento = fechaNacimiento;
//     }
    

//     public Cliente() {
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

//     public String getEmail() {
//         return email;
//     }

//     public void setEmail(String email) {
//         this.email = email;
//     }

//     public String getApellido() {
//         return apellido;
//     }

//     public void setApellido(String apellido) {
//         this.apellido = apellido;
//     }

//     public String getFechaNacimiento() {
//         return fechaNacimiento;
//     }

//     public void setFechaNacimiento(String fechaNacimiento) {
//         this.fechaNacimiento = fechaNacimiento;
//     }
// }
