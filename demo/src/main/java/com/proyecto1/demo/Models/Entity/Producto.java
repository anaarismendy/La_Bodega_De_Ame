package com.proyecto1.demo.Models.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "producto")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private Double precio;
    private String descripcion;
    private Integer cantidad;

    @Column(name = "precio_original")
    private Double precioOriginal;

    @Column(name = "imagen_url", length = 512)
    private String imagenUrl;

    @Column(name = "categoria")
    private String categoria;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "boton_texto")
    private String botonTexto;

    @Column(name = "has_discount")
    private Boolean hasDiscount;

    @Column(name = "detalles", columnDefinition = "TEXT")
    private String detalles;

    public Producto(Long id, String nombre, Double precio, String descripcion, Integer cantidad) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.precioOriginal = null;
        this.imagenUrl = null;
        this.categoria = "General";
        this.rating = 5;
        this.botonTexto = "Agregar al carrito";
        this.hasDiscount = Boolean.FALSE;
        this.detalles = null;
    }

    public Producto() {
        this.botonTexto = "Agregar al carrito";
        this.hasDiscount = Boolean.FALSE;
        this.categoria = "General";
        this.rating = 5;
    }

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

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Double getPrecioOriginal() {
        return precioOriginal;
    }

    public void setPrecioOriginal(Double precioOriginal) {
        this.precioOriginal = precioOriginal;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getBotonTexto() {
        return botonTexto;
    }

    public void setBotonTexto(String botonTexto) {
        this.botonTexto = botonTexto;
    }

    public Boolean getHasDiscount() {
        return hasDiscount;
    }

    public void setHasDiscount(Boolean hasDiscount) {
        this.hasDiscount = hasDiscount;
    }

    public String getDetalles() {
        return detalles;
    }

    public void setDetalles(String detalles) {
        this.detalles = detalles;
    }
}
