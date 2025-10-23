// Script específico para la página de detalle del producto
// Este archivo se ejecuta después de scripts.js

/**
 * Función para manejar la cantidad en la página de detalle del producto
 * Incrementa o decrementa la cantidad usando los botones +/-
 * 
 * @param {number} change - Valor a sumar o restar (positivo o negativo)
 */
function updateQuantityFromDetail(change) {
    const quantityInput = document.getElementById('inputQuantity');
    if (!quantityInput) return;
    
    const currentValue = parseInt(quantityInput.value) || 1;
    const minValue = parseInt(quantityInput.min) || 1;
    const maxValue = parseInt(quantityInput.max) || 999;
    const newValue = currentValue + change;
    
    // Validar que esté dentro de los límites
    if (newValue >= minValue && newValue <= maxValue) {
        quantityInput.value = newValue;
    } else if (newValue < minValue) {
        quantityInput.value = minValue;
        showNotification('La cantidad mínima es 1', 'info');
    } else if (newValue > maxValue) {
        quantityInput.value = maxValue;
        showNotification(`Solo hay ${maxValue} unidades disponibles`, 'warning');
    }
}

/**
 * Función para validar la cantidad antes de agregar al carrito
 * Se ejecuta cuando el usuario modifica manualmente el input
 */
function validateQuantityInput() {
    const quantityInput = document.getElementById('inputQuantity');
    if (!quantityInput) return;
    
    const value = parseInt(quantityInput.value);
    const min = parseInt(quantityInput.min) || 1;
    const max = parseInt(quantityInput.max) || 999;
    
    if (isNaN(value) || value < min) {
        quantityInput.value = min;
        showNotification('La cantidad mínima es 1', 'info');
    } else if (value > max) {
        quantityInput.value = max;
        showNotification(`Solo hay ${max} unidades disponibles`, 'warning');
    }
}

// Agregar evento de validación al input de cantidad cuando se carga la página de detalle
document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('inputQuantity');
    if (quantityInput) {
        // Validar cuando el usuario modifica el input manualmente
        quantityInput.addEventListener('change', validateQuantityInput);
        quantityInput.addEventListener('blur', validateQuantityInput);
        
        // También validar cuando presiona Enter
        quantityInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                validateQuantityInput();
            }
        });
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
    }, 400); // Esperar 0.4 segundos para que el carrusel se inicialice completamente
});