// Script específico para la página de detalle del producto
// Este archivo se ejecuta después de scripts.js

// Función para manejar la cantidad en la página de detalle
function updateQuantity(change) {
    const quantityInput = document.getElementById('inputQuantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value);
        const maxValue = parseInt(quantityInput.max);
        const newValue = currentValue + change;
        
        if (newValue >= 1 && newValue <= maxValue) {
            quantityInput.value = newValue;
        }
    }
}

// Función para validar la cantidad antes de agregar al carrito
function validateQuantity() {
    const quantityInput = document.getElementById('inputQuantity');
    if (quantityInput) {
        const value = parseInt(quantityInput.value);
        const max = parseInt(quantityInput.max);
        
        if (isNaN(value) || value < 1) {
            quantityInput.value = 1;
        } else if (value > max) {
            quantityInput.value = max;
            alert(`Solo hay ${max} unidades disponibles`);
        }
    }
}

// Agregar evento de validación al input de cantidad cuando se carga la página de detalle
document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('inputQuantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', validateQuantity);
        quantityInput.addEventListener('blur', validateQuantity);
    }
    
    // Scroll automático al contenido del producto después de que se cargue
    setTimeout(function() {
        const productSection = document.getElementById('product-section');
        if (productSection) {
            // Obtener la posición de la sección del producto
            const sectionRect = productSection.getBoundingClientRect();
            const scrollPosition = window.pageYOffset + sectionRect.top - 20; // -20px para un poco de espacio
            
            // Hacer scroll suave a la posición de la sección del producto
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
    }, 400); // Esperar 0.6 segundos para que el carrusel se inicialice completamente
});