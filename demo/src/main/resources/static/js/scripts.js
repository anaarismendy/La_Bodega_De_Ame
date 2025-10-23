

/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/

/**
 * Variable global para almacenar la lista de productos cargados desde la API
 * Formato: Array de objetos con propiedades {id, name, price, originalPrice, image, hasDiscount, rating, buttonText, description, category, stock}
 */
let products = [];

/**
 * Variable global para el contador de items en el carrito
 * Se mantiene para compatibilidad con el sistema de carrito existente
 */
let cartItemCount = 0;

/**
 * Servicio para cargar productos desde la API REST
 * Implementa el patrón Repository para abstraer el acceso a datos
 * 
 * @returns {Promise<Array>} Array de productos mapeados al formato del frontend
 * @throws {Error} Si hay problemas de conectividad o formato de datos
 */
async function loadProducts() {
    try {
        const response = await fetch('/api/productos');

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const productosDB = await response.json();
        

        if (productosDB.length === 0) {
            products = [];
            return products;
        }

        // Mapeo de datos: Backend Entity -> Frontend Model
        products = productosDB.map(producto => ({
            id: producto.productoId,
            name: producto.nombre || "Producto sin nombre",
            price: parseFloat(producto.precio) || 0,
            originalPrice: producto.precio_original ? parseFloat(producto.precio_original) : null,
            image: producto.imagen || "https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?w=450&h=300&fit=crop",
            hasDiscount: producto.hay_descuento || false,
            rating: parseInt(producto.rating) || 5,
            buttonText: (producto.stock > 0) ? "Add to cart" : "View options",
            description: producto.descripcion || "Descripción no disponible",
            category: "Productos", // TODO: Mapear desde categoriaId cuando se implemente la tabla de categorías
            stock: parseInt(producto.stock) || 0
        }));


        return products;
    } catch (error) {
        console.error('Error cargando productos desde la API:', error);
        // Fallback: Productos por defecto para mantener funcionalidad
        return getFallbackProducts();
    }
}

/**
 * Productos de fallback cuando la API no está disponible
 * Implementa el patrón Strategy para manejar diferentes fuentes de datos
 * 
 * @returns {Array} Array de productos por defecto
 */
function getFallbackProducts() {
        products = [
            {
                id: 1,
                name: "Vino Tinto Premium",
                price: 45.00,
                originalPrice: null,
                image: "https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?w=450&h=300&fit=crop",
                hasDiscount: false,
                rating: 5,
                buttonText: "Add to cart",
                description: "Un exquisito vino tinto premium con cuerpo completo.",
                category: "Vinos",
                stock: 15
        },
        {
            id: 2,
            name: "Whisky Johnnie Walker Black Label",
            price: 85.00,
            originalPrice: 120.00,
            image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=450&h=300&fit=crop",
            hasDiscount: true,
            rating: 4,
            buttonText: "Add to cart",
            description: "Whisky escocés premium con un sabor distintivo y complejo.",
            category: "Whisky",
            stock: 8
        }
        ];
        return products;
}

/**
 * Utilidad para extraer parámetros de la URL
 * Implementa el patrón Utility para operaciones comunes
 * 
 * @param {string} name - Nombre del parámetro a extraer
 * @returns {string|null} Valor del parámetro o null si no existe
 */
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Generador de HTML para estrellas de calificación
 * Implementa el patrón Factory para crear elementos UI consistentes
 * 
 * @param {number} rating - Número de estrellas a mostrar (1-5)
 * @returns {string} HTML con las estrellas generadas
 */
function generateStars(rating) {
    const validRating = Math.max(1, Math.min(5, rating || 0));
    return '<div class="bi-star-fill"></div>'.repeat(validRating);
}

/**
 * Factory para crear elementos HTML de tarjetas de producto
 * Implementa Single Responsibility: Solo se encarga de generar HTML de tarjetas
 * Implementa Open/Closed: Extensible para nuevos tipos de tarjetas sin modificar código existente
 * 
 * @param {Object} product - Objeto producto con propiedades {id, name, price, originalPrice, image, hasDiscount, rating, buttonText, description, stock}
 * @returns {string} HTML de la tarjeta del producto
 */
function createProductCard(product) {
    const badges = generateProductBadges(product);
    const ratingSection = generateRatingSection(product.rating);
    const priceSection = generatePriceSection(product);
    const cardClasses = generateCardClasses(product);
    const actionButton = generateActionButton(product);

    return `
        <div class="col mb-5">
            <div class="${cardClasses.main}" style="cursor: pointer;" onclick="viewProduct(${product.id})">
                ${badges}
                <img class="${cardClasses.image}" src="${product.image}" alt="${product.name}" style="cursor: pointer;" />
                <div class="card-body p-4">
                    <div class="text-center">
                        <h5 class="fw-bolder" style="cursor: pointer;">${product.name}</h5>
                        ${ratingSection}
                        ${priceSection}
                        ${product.stock === 0 ? '<p class="text-danger mt-2 mb-0"><small>No disponible</small></p>' : ''}
                    </div>
                </div>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                        ${actionButton}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Genera las insignias (badges) del producto
 * Implementa Single Responsibility: Solo maneja la generación de badges
 * 
 * @param {Object} product - Objeto producto
 * @returns {string} HTML de las insignias
 */
function generateProductBadges(product) {
    let discountBadge = '';

    if (product.hasDiscount && product.originalPrice && product.originalPrice > product.price) {
        const discountPercentage = Math.round((1 - product.price / product.originalPrice) * 100);
        discountBadge = `<div class="badge text-white position-absolute" style="background-color: #ff6b35; top: 0.5rem; right: 0.5rem; font-size: 0.8rem; animation: pulse 2s infinite;">
                            <i class="bi-percent"></i> -${discountPercentage}%
                        </div>`;
    }

    const stockBadge = product.stock === 0 ?
        '<div class="badge bg-secondary text-white position-absolute" style="top: 0.5rem; left: 0.5rem">Sin Stock</div>' : '';

    return discountBadge + stockBadge;
}

/**
 * Genera la sección de calificación con estrellas
 * Implementa Single Responsibility: Solo maneja la generación de rating
 * 
 * @param {number} rating - Calificación del producto (1-5)
 * @returns {string} HTML de la sección de rating
 */
function generateRatingSection(rating) {
    return rating ?
        `<div class="d-flex justify-content-center small text-warning mb-2">
             ${generateStars(rating)}
         </div>` : '';
}

/**
 * Genera la sección de precios con descuentos
 * Implementa Single Responsibility: Solo maneja la generación de precios
 * 
 * @param {Object} product - Objeto producto con propiedades de precio
 * @returns {string} HTML de la sección de precios
 */
function generatePriceSection(product) {
    if (product.hasDiscount && product.originalPrice && product.originalPrice > product.price) {
        const discountPercentage = Math.round((1 - product.price / product.originalPrice) * 100);
        return `
            <div class="price-section">
                <div class="original-price text-muted text-decoration-line-through small mb-1">
                    $${(product.originalPrice || 0).toFixed(2)}
                    </div>
                <div class="current-price">
                    <span class="fw-bold fs-5" style="color: #ff6b35;">$${(product.price || 0).toFixed(2)}</span>
                    <span class="badge ms-2" style="background-color: #ff6b35;">-${discountPercentage}%</span>
                </div>
            </div>
        `;
    }

    return `
        <div class="price-section">
            <div class="current-price">
                <span class="text-dark fw-bold fs-5">$${(product.price || 0).toFixed(2)}</span>
            </div>
        </div>
    `;
}

/**
 * Genera las clases CSS para la tarjeta según el estado del producto
 * Implementa Single Responsibility: Solo maneja las clases CSS
 * 
 * @param {Object} product - Objeto producto
 * @returns {Object} Objeto con clases CSS {main, image}
 */
function generateCardClasses(product) {
    const isOutOfStock = product.stock === 0;
    return {
        main: isOutOfStock ? 'card h-100 out-of-stock' : 'card h-100',
        image: isOutOfStock ? 'card-img-top out-of-stock-img' : 'card-img-top'
    };
}

/**
 * Genera el botón de acción según el estado del producto
 * Implementa Single Responsibility: Solo maneja la generación del botón de acción
 * 
 * @param {Object} product - Objeto producto
 * @returns {string} HTML del botón de acción
 */
/**
 * Genera los botones de acción para las cards de productos
 * Incluye botones para agregar al carrito, editar y eliminar
 * 
 * @param {Object} product - Producto para generar los botones
 * @returns {string} HTML de los botones
 */
function generateActionButton(product) {
    // CORREGIDO: Mostrar TODOS los botones (incluyendo edición/eliminación) para TODOS los productos
    // Independientemente del stock, los usuarios deben poder editar y eliminar productos
    return generateCardButtons(product);
}

/**
 * Genera los botones completos para la gestión de productos
 * Incluye: Agregar al carrito, Editar y Eliminar
 * 
 * @param {Object} product - Producto para generar los botones
 * @returns {string} HTML de todos los botones
 */
function generateCardButtons(product) {
    // Determinar si el producto tiene stock
    const hasStock = product.stock > 0;
    
    // Para productos sin stock, mostrar solo botones de administración
    if (!hasStock) {
        return `
            <div class="d-grid gap-2">
                <!-- Botones de administración para productos sin stock -->
                <div class="btn-group" role="group">
                    <a class="btn btn-outline-dark btn-sm" href="#" onclick="event.stopPropagation(); EditProduct(${product.id})" 
                       title="Editar producto">
                        <i class="bi-pencil"></i>
                    </a>
                    <a class="btn btn-outline-secondary btn-sm" href="#" onclick="event.stopPropagation(); RemoveProduct(${product.id})" 
                       title="Eliminar producto">
                        <i class="bi-trash"></i>
                    </a>
                </div>
                
                <!-- Botón de ver detalle -->
                <a class="btn btn-outline-dark btn-sm" href="#" onclick="event.stopPropagation(); viewProduct(${product.id})">
                    <i class="bi-eye me-1"></i>Ver detalle
                </a>
            </div>
        `;
    }
    
    // Para productos con stock, mostrar todos los botones incluyendo el principal
    return `
        <div class="d-grid gap-2">
            <!-- Control de cantidad compacto -->
            <div class="quantity-control-card" onclick="event.stopPropagation();">
                <label class="quantity-label-card">Cantidad:</label>
                <div class="input-group input-group-sm">
                    <button class="btn btn-outline-secondary" type="button" onclick="event.stopPropagation(); updateCardQuantity(${product.id}, -1)">
                        <i class="bi-dash"></i>
                    </button>
                    <input type="number" class="form-control text-center quantity-input-card" 
                           id="quantity-${product.id}" 
                           value="1" 
                           min="1" 
                           max="${product.stock}" 
                           onclick="event.stopPropagation();"
                           onchange="validateCardQuantity(${product.id})">
                    <button class="btn btn-outline-secondary" type="button" onclick="event.stopPropagation(); updateCardQuantity(${product.id}, 1)">
                        <i class="bi-plus"></i>
                    </button>
                </div>
            </div>
            
            <!-- Botón principal: Agregar al carrito (solo para productos con stock) -->
            <a class="btn btn-sm" style="background-color: #ff6b35; border-color: #ff6b35; color: white;" href="#" onclick="event.stopPropagation(); addToCartFromMain(${product.id})">
                <i class="bi-cart-plus me-1"></i>Agregar al carrito
            </a>
            
            <!-- Botones de administración -->
            <div class="btn-group" role="group">
                <a class="btn btn-outline-dark btn-sm" href="#" onclick="event.stopPropagation(); EditProduct(${product.id})" 
                   title="Editar producto">
                    <i class="bi-pencil"></i>
                </a>
                <a class="btn btn-outline-secondary btn-sm" href="#" onclick="event.stopPropagation(); RemoveProduct(${product.id})" 
                   title="Eliminar producto">
                    <i class="bi-trash"></i>
                </a>
            </div>
            
            <!-- Botón de ver detalle -->
            <a class="btn btn-outline-dark btn-sm" href="#" onclick="event.stopPropagation(); viewProduct(${product.id})">
                <i class="bi-eye me-1"></i>Ver detalle
            </a>
        </div>
    `;
}


/**
 * Elimina un producto de la base de datos con confirmación del usuario
 * Implementa el patrón de confirmación antes de acciones destructivas
 * 
 * @param {number} productId - ID del producto a eliminar
 * @returns {Promise<void>}
 */
async function RemoveProduct(productId) {
    try {
        // 1. Buscar el producto para mostrar su nombre en la confirmación
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            showNotification('Producto no encontrado', 'error');
            return;
        }

        // 2. Mostrar diálogo de confirmación
        const confirmMessage = `¿Estás seguro de que deseas eliminar el producto "${product.name}"?\n\nEsta acción no se puede deshacer.`;
        const userConfirmed = confirm(confirmMessage);
        
        if (!userConfirmed) {
            showNotification('Eliminación cancelada', 'info');
            return;
        }

        // 3. Mostrar indicador de carga
        showNotification('Eliminando producto...', 'info');

        // 4. Realizar la eliminación en el backend
        const response = await fetch(`/api/productos/delete/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // 5. Verificar respuesta del servidor
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Producto no encontrado en el servidor');
            } else if (response.status === 500) {
                throw new Error('Error interno del servidor');
            } else {
                throw new Error(`Error del servidor: ${response.status}`);
            }
        }

        // 6. Eliminar el producto del array local
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            products.splice(productIndex, 1);
        }

        // 7. Re-renderizar la lista de productos
        renderProducts();

        // 8. Mostrar mensaje de éxito
        showNotification(`Producto "${product.name}" eliminado exitosamente`, 'success');

    } catch (error) {
        console.error('Error eliminando producto:', error);
        showNotification(`Error al eliminar producto: ${error.message}`, 'error');
    }
}

async function EditProduct(productId) {

    try {
        const product = products.find(p => p.id === productId);

        if (!product) {
            showNotification('Producto no encontrado', 'error');
            return;
        }

        // Almacenar el ID del producto que se está editando
        window.currentEditingProductId = productId;

        fillEditProductModal(product);

        setupEditFormEvent();

        const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
        editModal.show();
    } catch (error) {
        console.error('Error al editar el producto:', error);
        showNotification('Error al editar el producto', 'error');
    }
}
function fillEditProductModal(product) {
    // Información básica
    document.getElementById('editProductoNombre').value = product.name || '';
    document.getElementById('editProductoDescripcion').value = product.description || '';

    // Precios
    document.getElementById('editProductoPrecio').value = product.price || '';
    document.getElementById('editProductoPrecioOriginal').value = product.originalPrice || '';
    document.getElementById('editProductoDescuento').value = product.descuento || '';

    // Checkbox de descuento
    document.getElementById('editProductoHayDescuento').checked = product.hasDiscount || false;

    // Stock y rating
    document.getElementById('editProductoStock').value = product.stock || '';
    document.getElementById('editProductoRating').value = product.rating || '';

    // Imagen
    document.getElementById('editProductoImagen').value = product.image || '';

    // Aplicar lógica de descuentos después de llenar los campos
    toggleEditDiscountFields();
}

function setupEditFormEvent() {
    const form = document.getElementById('editProductForm');
    const descuentoCheckbox = document.getElementById('editProductoHayDescuento');

    form.removeEventListener('submit', handleEditFormSubmit);
    form.addEventListener('submit', handleEditFormSubmit);

    descuentoCheckbox.removeEventListener('change', toggleEditDiscountFields);
    descuentoCheckbox.addEventListener('change', toggleEditDiscountFields);

    const precioOriginalInput = document.getElementById('editProductoPrecioOriginal');
    const precioInput = document.getElementById('editProductoPrecio');

    precioOriginalInput.removeEventListener('input', calculateEditDiscount);
    precioInput.removeEventListener('input', calculateEditDiscount);

    precioOriginalInput.addEventListener('input', calculateEditDiscount);
    precioInput.addEventListener('input', calculateEditDiscount);

    loadEditCategories();

}

async function handleEditFormSubmit(event) {
    event.preventDefault();

    try {
        if (!validateEditForm()) return;

        const formData = getEditFormData();

        const productId = getCurrentEditingProductId();

        const updateBtn = document.getElementById('updateProductBtn');
        const originalText = updateBtn.innerHTML;
        updateBtn.innerHTML = '<i class="bi-arrow-clockwise spin me-1"></i>Actualizando...';
        updateBtn.disabled = true;

        const response = await fetch(`/api/productos/update/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar producto');
        }

        const updatedProduct = await response.json();

        updateProductInArray(productId, updatedProduct);

        renderProducts();

        const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        modal.hide();

        showNotification('Producto actualizado correctamente', 'success');


    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        showNotification('Error al actualizar el producto', 'error');
    } finally {
        const updateBtn = document.getElementById('updateProductBtn');
        updateBtn.innerHTML = '<i class="bi-check-circle me-1"></i>Actualizar Producto';
        updateBtn.disabled = false;
    }
}

function getEditFormData() {
    const hayDescuento = document.getElementById('editProductoHayDescuento').checked;

    const categoriaSelect = document.getElementById('editProductoCategoria');
    const categoriaValue = categoriaSelect.value;
    const categoriaId = parseInt(categoriaValue);

    if (!categoriaValue || categoriaValue === '' || isNaN(categoriaId)) {
        throw new Error('Debe seleccionar una categoría válida');
    }

    return {
        nombre: document.getElementById('editProductoNombre').value.trim(),
        categoria_id: categoriaId,
        descripcion: document.getElementById('editProductoDescripcion').value.trim() || null,
        precio: parseFloat(document.getElementById('editProductoPrecio').value),
        precio_original: hayDescuento ? parseFloat(document.getElementById('editProductoPrecioOriginal').value) : null,
        descuento: hayDescuento ? parseFloat(document.getElementById('editProductoDescuento').value) : 0,
        hay_descuento: hayDescuento,
        stock: parseInt(document.getElementById('editProductoStock').value) || 0,
        rating: parseInt(document.getElementById('editProductoRating').value) || null,
        imagen: document.getElementById('editProductoImagen').value.trim() || null
    };
}

function validateEditForm() {
    const nombre = document.getElementById('editProductoNombre').value.trim();
    const precio = parseFloat(document.getElementById('editProductoPrecio').value);
    const stock = parseInt(document.getElementById('editProductoStock').value) || 0;
    const rating = parseInt(document.getElementById('editProductoRating').value);
    const hayDescuento = document.getElementById('editProductoHayDescuento').checked;
    const precioOriginal = parseFloat(document.getElementById('editProductoPrecioOriginal').value);

    if (!nombre) {
        showNotification('El nombre del producto es requerido', 'error');
        return false;
    }

    if (isNaN(precio) || precio <= 0) {
        showNotification('El precio del producto debe ser mayor a 0', 'error');
        return false;
    }

    if (stock < 0) {
        showNotification('El stock no puede ser negativo', 'error');
        return false;
    }

    if (rating && (rating < 1 || rating > 5)) {
        showNotification('La calificación debe estar entre 1 y 5 estrellas', 'error');
        return false;
    }

    if (hayDescuento) {
        if (isNaN(precioOriginal) || precioOriginal <= 0) {
            showNotification('El precio original es obligatorio cuando hay descuento', 'error');
            return false;
        }

        if (precioOriginal <= precio) {
            showNotification('El precio original debe ser mayor al precio con descuento', 'error');
            return false;
        }
    }

    return true;
}

    /**
     * Función placeholder para añadir un nuevo producto
     * TODO: Implementar funcionalidad completa de creación de productos
     * 
     * Esta función será llamada desde el botón "Añadir Producto" en el navbar
     */
    function addNewProduct() {
        console.log('Función addNewProduct() llamada');

        // Cargar categorías y abrir modal
        loadCategories();
        const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
        modal.show();

        // Configurar eventos del formulario
        setupProductFormEvent();
    }

    async function loadCategories() {
        try {
            const response = await fetch(`/api/categorias`);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const categorias = await response.json();
            const select = document.getElementById('productoCategoria');
            if (!select) {
                throw new Error('Elemento select de categorías no encontrado');
            }

            select.innerHTML = '<option value="">Selecciona una categoría</option>';

            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.categoria_id;
                option.textContent = categoria.nombre;
                select.appendChild(option);
            });

        } catch (error) {
            console.error('Error cargando categorías:', error);
            showNotification('Error al cargar las categorías', 'error');
        }
    }


    function setupProductFormEvent() {
        const form = document.getElementById('addProductForm');
        const descuentoCheckbox = document.getElementById('productoHayDescuento');

        // Evento de envío del formulario
        form.addEventListener('submit', handleProductFormSubmit);

        // Evento del checkbox de descuento
        descuentoCheckbox.addEventListener('change', toggleDiscountFields);

        // Eventos para calcular descuento automáticamente
        const precioOriginal = document.getElementById('productoPrecioOriginal');
        const precio = document.getElementById('productoPrecio');

        precioOriginal.addEventListener('input', calculateDiscount);
        precio.addEventListener('input', calculateDiscount);

        // Inicializar estado de los campos
        toggleDiscountFields();
    }

    /**
     * Maneja la lógica del checkbox de descuento
     * - Si está marcado: habilita precio original y calcula descuento automáticamente
     * - Si no está marcado: deshabilita precio original y limpia descuento
     */
    function toggleDiscountFields() {
        const hayDescuento = document.getElementById('productoHayDescuento').checked;
        const precioOriginalField = document.getElementById('productoPrecioOriginal');
        const descuentoField = document.getElementById('productoDescuento');
        const precioField = document.getElementById('productoPrecio');

        if (hayDescuento) {
            // HABILITAR campos de descuento
            precioOriginalField.disabled = false;
            precioOriginalField.required = true;
            descuentoField.disabled = false;
            descuentoField.readOnly = true; // Se calcula automáticamente

            // Cambiar labels y placeholders
            precioField.placeholder = "Precio con descuento";
            precioOriginalField.placeholder = "Precio original (sin descuento)";

            // Limpiar campos
            precioOriginalField.value = '';
            descuentoField.value = '';

        } else {
            // DESHABILITAR campos de descuento
            precioOriginalField.disabled = true;
            precioOriginalField.required = false;
            descuentoField.disabled = true;
            descuentoField.readOnly = false;

            // Cambiar labels y placeholders
            precioField.placeholder = "Precio del producto";
            precioOriginalField.placeholder = "";

            // Limpiar campos
            precioOriginalField.value = '';
            descuentoField.value = '';
        }
    }

    /**
     * Calcula el porcentaje de descuento automáticamente
     * basado en el precio original y el precio con descuento
     */
    function calculateDiscount() {
        const hayDescuento = document.getElementById('productoHayDescuento').checked;

        if (!hayDescuento) return;

        const precioOriginal = parseFloat(document.getElementById('productoPrecioOriginal').value);
        const precio = parseFloat(document.getElementById('productoPrecio').value);
        const descuentoField = document.getElementById('productoDescuento');

        if (precioOriginal && precio && precioOriginal > precio) {
            // Calcular porcentaje de descuento
            const descuento = ((precioOriginal - precio) / precioOriginal) * 100;
            descuentoField.value = descuento.toFixed(2);

            // Validar que el descuento sea válido
            if (descuento < 0) {
                descuentoField.value = '0.00';
                showNotification('El precio con descuento no puede ser mayor al precio original', 'warning');
            } else if (descuento > 100) {
                descuentoField.value = '100.00';
                showNotification('El descuento no puede ser mayor al 100%', 'warning');
            }
        } else if (precioOriginal && precio && precioOriginal <= precio) {
            descuentoField.value = '0.00';
            showNotification('El precio original debe ser mayor al precio con descuento', 'warning');
        }
    }

    async function handleProductFormSubmit(event) {
        event.preventDefault();

        if (!validateProductForm()) return;

        try {
            const formData = getProductFormData();

            console.log('Datos del formulario a enviar:', formData);

            const response = await fetch('/api/productos/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showNotification('Producto creado correctamente', 'success');
                closeModalAndReset();
                // Recargar la lista de productos
                loadProducts();
            } else {
                const errorData = await response.json().catch(() => null);
                console.error('Error del servidor:', errorData);
                showNotification(`Error al crear el producto: ${response.status}`, 'error');
            }

        } catch (error) {
            console.error('Error en el envío:', error);
            if (error.message) {
                showNotification(error.message, 'error');
            } else {
                showNotification('Error de conexión', 'error');
            }
        }
    }

    function validateProductForm() {
        // Campos básicos requeridos
        const basicRequiredFields = ['productoNombre', 'productoCategoria', 'productoPrecio'];

        for (let field of basicRequiredFields) {
            if (!document.getElementById(field).value.trim()) {
                showNotification('Los campos básicos son requeridos: Nombre, Categoría y Precio', 'error');
                return false;
            }
        }

        // Validar precio
        const precio = parseFloat(document.getElementById('productoPrecio').value);
        if (precio <= 0) {
            showNotification('El precio debe ser mayor a 0', 'error');
            return false;
        }

        // Validar lógica de descuento
        const hayDescuento = document.getElementById('productoHayDescuento').checked;

        if (hayDescuento) {
            const precioOriginal = parseFloat(document.getElementById('productoPrecioOriginal').value);

            if (!precioOriginal || precioOriginal <= 0) {
                showNotification('Debe ingresar un precio original válido cuando el producto tiene descuento', 'error');
                return false;
            }

            if (precioOriginal <= precio) {
                showNotification('El precio original debe ser mayor al precio con descuento', 'error');
                return false;
            }
        }

        // Validar stock
        const stock = parseInt(document.getElementById('productoStock').value);
        if (stock < 0) {
            showNotification('El stock no puede ser negativo', 'error');
            return false;
        }

        // Validar rating si se proporciona
        const rating = parseInt(document.getElementById('productoRating').value);
        if (rating && (rating < 1 || rating > 5)) {
            showNotification('La calificación debe estar entre 1 y 5 estrellas', 'error');
            return false;
        }

        return true;
    }

    function getProductFormData() {
        const hayDescuento = document.getElementById('productoHayDescuento').checked;

        const categoriaSelect = document.getElementById('productoCategoria');
        const categoriaValue = categoriaSelect.value;
        const categoriaId = parseInt(categoriaValue);

        // Validar que la categoría sea válida
        if (!categoriaValue || categoriaValue === '' || isNaN(categoriaId)) {
            throw new Error('Debe seleccionar una categoría válida');
        }

        return {
            nombre: document.getElementById('productoNombre').value.trim(),
            categoria_id: categoriaId,
            descripcion: document.getElementById('productoDescripcion').value.trim() || null,
            precio: parseFloat(document.getElementById('productoPrecio').value),
            precio_original: hayDescuento ? parseFloat(document.getElementById('productoPrecioOriginal').value) : null,
            descuento: hayDescuento ? parseFloat(document.getElementById('productoDescuento').value) : 0,
            hay_descuento: hayDescuento,
            stock: parseInt(document.getElementById('productoStock').value) || 0,
            rating: parseInt(document.getElementById('productoRating').value) || null,
            imagen: document.getElementById('productoImagen').value.trim() || null
        };
    }

function closeModalAndReset() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    modal.hide();
    document.getElementById('addProductForm').reset();
    // Resetear campos de descuento a estado inicial
    toggleDiscountFields();
}

/**
 * Toggle de campos de descuento para el modal de edición
 * Reutiliza la lógica del modal de agregar pero con prefijo 'editProducto'
 */
function toggleEditDiscountFields() {
    const hayDescuento = document.getElementById('editProductoHayDescuento').checked;
    const precioOriginalField = document.getElementById('editProductoPrecioOriginal');
    const descuentoField = document.getElementById('editProductoDescuento');
    const precioField = document.getElementById('editProductoPrecio');

    if (hayDescuento) {
        // HABILITAR campos de descuento
        precioOriginalField.disabled = false;
        precioOriginalField.required = true;
        descuentoField.disabled = false;
        descuentoField.readOnly = true; // Se calcula automáticamente

        // Cambiar placeholders
        precioField.placeholder = "Precio con descuento";
        precioOriginalField.placeholder = "Precio original (sin descuento)";

        // Calcular descuento automáticamente si hay valores
        calculateEditDiscount();
    } else {
        // DESHABILITAR campos de descuento
        precioOriginalField.disabled = true;
        precioOriginalField.required = false;
        descuentoField.disabled = true;
        descuentoField.readOnly = false;

        // Resetear placeholders
        precioField.placeholder = "0.00";
        precioOriginalField.placeholder = "Solo para productos con descuento";

        // Limpiar descuento pero mantener precio original
        descuentoField.value = '0';
    }
}

/**
 * Calcula descuento automáticamente para el modal de edición
 * Reutiliza la lógica del modal de agregar pero con prefijo 'editProducto'
 */
function calculateEditDiscount() {
    const hayDescuento = document.getElementById('editProductoHayDescuento').checked;

    if (!hayDescuento) return;

    const precioOriginal = parseFloat(document.getElementById('editProductoPrecioOriginal').value);
    const precio = parseFloat(document.getElementById('editProductoPrecio').value);
    const descuentoField = document.getElementById('editProductoDescuento');

    if (precioOriginal && precio && precioOriginal > precio) {
        // Calcular porcentaje de descuento
        const descuento = ((precioOriginal - precio) / precioOriginal) * 100;
        descuentoField.value = descuento.toFixed(2);

        // Validar que el descuento sea válido
        if (descuento < 0) {
            showNotification('El precio original debe ser mayor al precio con descuento', 'error');
            descuentoField.value = '';
        } else if (descuento >= 100) {
            showNotification('El descuento no puede ser del 100% o mayor', 'error');
            descuentoField.value = '';
        }
    } else if (precioOriginal && precio && precioOriginal <= precio) {
        showNotification('El precio original debe ser mayor al precio con descuento', 'error');
        descuentoField.value = '';
    }
}

/**
 * Carga las categorías en el dropdown del modal de edición
 * Reutiliza la lógica del modal de agregar pero con el select de edición
 */
async function loadEditCategories() {
    try {
        const response = await fetch('/api/categorias');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const categorias = await response.json();
        const select = document.getElementById('editProductoCategoria');
        
        if (!select) {
            throw new Error('Elemento select de categorías de edición no encontrado');
        }
        
        // Limpiar opciones excepto la primera
        select.innerHTML = '<option value="">Selecciona una categoría</option>';

        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.categoria_id;
            option.textContent = categoria.nombre;
            select.appendChild(option);
        });
        
    } catch (error) {
        console.error('Error cargando categorías para edición:', error);
        showNotification('Error al cargar las categorías', 'error');
    }
}

/**
 * Obtiene el ID del producto que se está editando actualmente
 */
function getCurrentEditingProductId() {
    return window.currentEditingProductId || null;
}

/**
 * Actualiza un producto en el array local después de la edición
 */
function updateProductInArray(productId, updatedProduct) {
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        // Mapear el producto actualizado al formato del frontend
        products[index] = {
            id: updatedProduct.productoId,
            name: updatedProduct.nombre,
            price: parseFloat(updatedProduct.precio) || 0,
            originalPrice: updatedProduct.precio_original ? parseFloat(updatedProduct.precio_original) : null,
            image: updatedProduct.imagen,
            hasDiscount: updatedProduct.hay_descuento || false,
            rating: parseInt(updatedProduct.rating) || 5,
            buttonText: (updatedProduct.stock > 0) ? "Add to cart" : "View options",
            description: updatedProduct.descripcion || "Descripción no disponible",
            category: "Productos",
            stock: parseInt(updatedProduct.stock) || 0
        };
    }
}


    /**
     * Renderizador principal para la lista de productos
     * Implementa Single Responsibility: Solo maneja el renderizado de la lista
     * Implementa Dependency Inversion: Depende de abstracciones (createProductCard) no de implementaciones concretas
     * 
     * @returns {void}
     */
function renderProducts() {
        const container = getProductsContainer();
        if (!container) return;

        if (products.length === 0) {
            renderEmptyState(container);
            return;
        }

        renderProductsList(container);
    }

    /**
     * Obtiene el contenedor de productos de forma segura
     * Implementa Single Responsibility: Solo maneja la obtención del contenedor
     * 
     * @returns {HTMLElement|null} Contenedor de productos o null si no existe
     */
    function getProductsContainer() {
    const container = document.getElementById('products-container');
    if (!container) {
            // Silencioso: No es un error, simplemente no estamos en la página de productos
            return null;
        }
        return container;
    }

    /**
     * Renderiza el estado vacío cuando no hay productos
     * Implementa Single Responsibility: Solo maneja el estado vacío
     * 
     * @param {HTMLElement} container - Contenedor donde renderizar
     * @returns {void}
     */
    function renderEmptyState(container) {
        container.innerHTML = `
        <div class="col-12 text-center py-5">
            <h3>No hay productos disponibles</h3>
            <p class="text-muted">Los productos se están cargando desde la base de datos...</p>
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;
    }

    /**
     * Renderiza la lista completa de productos
     * Implementa Single Responsibility: Solo maneja el renderizado de la lista
     * 
     * @param {HTMLElement} container - Contenedor donde renderizar
     * @returns {void}
     */
    function renderProductsList(container) {

        const productsHTML = products
            .map(product => createProductCard(product))
            .join('');
    
    container.innerHTML = productsHTML;
}

    /**
     * Navegador a la página de detalle del producto
     * Implementa Single Responsibility: Solo maneja la navegación
     * 
     * @param {number} productId - ID del producto a visualizar
     * @returns {void}
     */
function viewProduct(productId) {
        window.location.href = `/item_detail?id=${productId}`;
    }

    /**
     * Servicio para obtener un producto específico por ID desde la API
     * Implementa el patrón Repository para acceso a datos individuales
     * Implementa Single Responsibility: Solo maneja la obtención de productos individuales
     * 
     * @param {number} productId - ID del producto a obtener
     * @returns {Promise<Object|null>} Producto mapeado al formato del frontend o null si hay error
     */
    async function getProductById(productId) {
        try {
            const response = await fetch(`/api/productos/${productId}`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const productoDB = await response.json();
            return mapProductFromAPI(productoDB);
        } catch (error) {
            console.error('Error obteniendo producto desde la API:', error);
            return null;
        }
    }

    /**
     * Mapea un producto de la API al formato del frontend
     * Implementa Single Responsibility: Solo maneja el mapeo de datos
     * 
     * @param {Object} productoDB - Producto desde la API
     * @returns {Object} Producto en formato del frontend
     */
    function mapProductFromAPI(productoDB) {
        return {
            id: productoDB.productoId,
            name: productoDB.nombre || "Producto sin nombre",
            price: parseFloat(productoDB.precio) || 0,
            originalPrice: productoDB.precio_original ? parseFloat(productoDB.precio_original) : null,
            image: productoDB.imagen || "https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?w=450&h=300&fit=crop",
            hasDiscount: productoDB.hay_descuento || false,
            rating: parseInt(productoDB.rating) || 5,
            buttonText: (productoDB.stock > 0) ? "Add to cart" : "View options",
            description: productoDB.descripcion || "Descripción no disponible",
            category: "Productos",
            stock: parseInt(productoDB.stock) || 0
        };
    }

    /**
     * Controlador principal para renderizar el detalle del producto
     * Implementa Single Responsibility: Solo coordina el renderizado de detalles
     * Implementa Strategy Pattern: Diferentes estrategias para obtener el producto
     * 
     * @returns {void}
     */
function renderProductDetail() {
    const productId = parseInt(getUrlParameter('id'));
        const container = getProductDetailContainer();
    
        if (!container) return;
    
    if (!productId) {
            renderProductNotFound(container);
        return;
    }

        // Strategy 1: Buscar en cache local
        const cachedProduct = findProductInCache(productId);
        if (cachedProduct) {
            renderProductDetailHTML(cachedProduct, container);
        return;
    }

        // Strategy 2: Cargar desde API
        loadAndRenderProductFromAPI(productId, container);
    }

    /**
     * Obtiene el contenedor de detalle de producto de forma segura
     * Implementa Single Responsibility: Solo maneja la obtención del contenedor
     * 
     * @returns {HTMLElement|null} Contenedor de detalle o null si no existe
     */
    function getProductDetailContainer() {
        const container = document.getElementById('product-detail-container');
        if (!container) {
            // Silencioso: No es un error, simplemente no estamos en la página de detalle
            return null;
        }
        return container;
    }

    /**
     * Busca un producto en el cache local (array products)
     * Implementa Single Responsibility: Solo maneja la búsqueda en cache
     * 
     * @param {number} productId - ID del producto a buscar
     * @returns {Object|null} Producto encontrado o null
     */
    function findProductInCache(productId) {
        return products.find(p => p.id === productId);
    }

    /**
     * Carga un producto desde la API y lo renderiza
     * Implementa Single Responsibility: Solo maneja la carga y renderizado desde API
     * 
     * @param {number} productId - ID del producto a cargar
     * @param {HTMLElement} container - Contenedor donde renderizar
     * @returns {void}
     */
    function loadAndRenderProductFromAPI(productId, container) {
        getProductById(productId).then(apiProduct => {
            if (apiProduct) {
                renderProductDetailHTML(apiProduct, container);
            } else {
                renderProductNotFound(container);
            }
        });
    }

    /**
     * Renderiza el estado de producto no encontrado
     * Implementa Single Responsibility: Solo maneja el estado de error
     * 
     * @param {HTMLElement} container - Contenedor donde renderizar
     * @returns {void}
     */
    function renderProductNotFound(container) {
        container.innerHTML = '<div class="text-center"><h2>Producto no encontrado</h2><a href="/" class="btn btn-primary">Volver al inicio</a></div>';
    }

    /**
     * Factory para crear el HTML completo del detalle del producto
     * Implementa Single Responsibility: Solo maneja la generación del HTML de detalle
     * Implementa Template Method: Estructura fija con componentes variables
     * 
     * @param {Object} product - Objeto producto con todas sus propiedades
     * @param {HTMLElement} container - Contenedor donde renderizar el HTML
     * @returns {void}
     */
    function renderProductDetailHTML(product, container) {
        updatePageTitle(product.name);

        const detailSections = generateDetailSections(product);
        const stockInfo = generateStockInfo(product);
        const actionSection = generateDetailActionSection(product);

        const productDetailHTML = createDetailHTML(product, detailSections, stockInfo, actionSection);
        container.innerHTML = productDetailHTML;
    }

    /**
     * Actualiza el título de la página con el nombre del producto
     * Implementa Single Responsibility: Solo maneja la actualización del título
     * 
     * @param {string} productName - Nombre del producto
     * @returns {void}
     */
    function updatePageTitle(productName) {
        document.title = `${productName} - La Bodega de Ana`;
    }

    /**
     * Genera todas las secciones del detalle del producto
     * Implementa Single Responsibility: Solo coordina la generación de secciones
     * 
     * @param {Object} product - Objeto producto
     * @returns {Object} Objeto con todas las secciones generadas
     */
    function generateDetailSections(product) {
        return {
            discountBadge: generateDetailDiscountBadge(product.hasDiscount),
            ratingSection: generateDetailRatingSection(product.rating),
            priceSection: generateDetailPriceSection(product),
            detailsSection: generateDetailDetailsSection(product.details)
        };
    }

    /**
     * Genera la insignia de descuento para el detalle
     * Implementa Single Responsibility: Solo maneja la insignia de descuento
     * 
     * @param {boolean} hasDiscount - Si el producto tiene descuento
     * @returns {string} HTML de la insignia de descuento
     */
    function generateDetailDiscountBadge(hasDiscount) {
        return hasDiscount ?
        '<span class="badge bg-danger me-2">En Oferta</span>' : '';
    }

    /**
     * Genera la sección de rating para el detalle
     * Implementa Single Responsibility: Solo maneja la sección de rating
     * 
     * @param {number} rating - Calificación del producto
     * @returns {string} HTML de la sección de rating
     */
    function generateDetailRatingSection(rating) {
        return rating ?
        `<div class="d-flex align-items-center mb-3">
            <div class="d-flex text-warning me-2">
                ${generateStars(rating)}
            </div>
            <span class="text-muted">(${rating}.0)</span>
        </div>` : '';
    }

    /**
     * Genera la sección de precios para el detalle
     * Implementa Single Responsibility: Solo maneja la sección de precios
     * 
     * @param {Object} product - Objeto producto con propiedades de precio
     * @returns {string} HTML de la sección de precios
     */
    function generateDetailPriceSection(product) {
        if (product.hasDiscount) {
            const discountPercentage = Math.round((1 - product.price / product.originalPrice) * 100);
            return `
            <div class="mb-3">
                <span class="text-muted text-decoration-line-through fs-5 me-2">$${(product.originalPrice || 0).toFixed(2)}</span>
                <span class="fs-3 fw-bold text-success">$${(product.price || 0).toFixed(2)}</span>
                <span class="badge bg-success ms-2">${discountPercentage}% OFF</span>
        </div>`;
        }

        return `
        <div class="mb-3">
            <span class="fs-3 fw-bold">$${(product.price || 0).toFixed(2)}</span>
        </div>`;
    }

    /**
     * Genera la sección de detalles adicionales
     * Implementa Single Responsibility: Solo maneja la sección de detalles
     * 
     * @param {Object} details - Objeto con detalles adicionales del producto
     * @returns {string} HTML de la sección de detalles
     */
    function generateDetailDetailsSection(details) {
        if (!details) return '';

        const detailsList = Object.entries(details)
            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
            .join('');

        return `
        <div class="row mt-4">
            <div class="col-12">
                <h6 class="fw-bold">Especificaciones:</h6>
                <ul class="list-unstyled">
                    ${detailsList}
                </ul>
            </div>
        </div>`;
    }

    /**
     * Genera la información de stock del producto
     * Implementa Single Responsibility: Solo maneja la información de stock
     * 
     * @param {Object} product - Objeto producto
     * @returns {Object} Objeto con clases CSS y sección de stock
     */
    function generateStockInfo(product) {
    const isOutOfStock = product.stock === 0;
    
        return {
            stockClass: isOutOfStock ? 'out-of-stock-detail' : '',
            imageClass: isOutOfStock ? 'card-img-top mb-5 mb-md-0 out-of-stock-img-detail' : 'card-img-top mb-5 mb-md-0',
            stockSection: isOutOfStock ?
        `<div class="d-flex align-items-center mb-4">
            <span class="me-3 text-danger"><strong>Stock:</strong> Sin stock disponible</span>
            <span class="badge bg-danger">No disponible</span>
        </div>` :
        `<div class="d-flex align-items-center mb-4">
            <span class="me-3"><strong>Stock:</strong> ${product.stock || 0} disponibles</span>
            </div>`
        };
    }

    /**
     * Genera la sección de acciones para el detalle del producto
     * Implementa Single Responsibility: Solo maneja la sección de acciones
     * 
     * @param {Object} product - Objeto producto
     * @returns {string} HTML de la sección de acciones
     */
    function generateDetailActionSection(product) {
        const isOutOfStock = product.stock === 0;

        if (isOutOfStock) {
            return generateOutOfStockActions(product.id);
        }

        return generateInStockActions(product.id, product.stock);
    }

    /**
     * Genera las acciones para productos sin stock
     * Implementa Single Responsibility: Solo maneja acciones de productos sin stock
     * 
     * @param {number} productId - ID del producto
     * @returns {string} HTML de las acciones sin stock
     */
    function generateOutOfStockActions(productId) {
        return `
        <div class="d-flex align-items-center mb-4">
            <div class="alert alert-warning" role="alert">
                <i class="bi-exclamation-triangle me-2"></i>
                Este producto no está disponible actualmente. Puedes contactarnos para más información.
            </div>
        </div>
        <div class="d-flex">
            <button class="btn btn-outline-secondary flex-shrink-0 me-3" type="button" disabled>
                <i class="bi-cart-fill me-1"></i>
                Sin stock
            </button>
            <button class="btn btn-outline-info flex-shrink-0" type="button" onclick="contactForProduct(${productId})">
                <i class="bi-envelope me-1"></i>
                Consultar disponibilidad
            </button>
        </div>`;
    }

    /**
     * Genera las acciones para productos con stock
     * Implementa Single Responsibility: Solo maneja acciones de productos con stock
     * 
     * @param {number} productId - ID del producto
     * @param {number} stock - Cantidad disponible en stock
     * @returns {string} HTML de las acciones con stock
     */
    function generateInStockActions(productId, stock) {
        return `
        <div class="d-flex align-items-center mb-3">
            <label class="me-2 fw-bold">Cantidad:</label>
            <div class="input-group" style="max-width: 180px;">
                <button class="btn btn-outline-secondary" type="button" onclick="updateQuantityFromDetail(-1)">
                    <i class="bi-dash"></i>
                </button>
                <input class="form-control text-center" id="inputQuantity" type="number" value="1" min="1" max="${stock || 1}" style="max-width: 5rem" />
                <button class="btn btn-outline-secondary" type="button" onclick="updateQuantityFromDetail(1)">
                    <i class="bi-plus"></i>
                </button>
            </div>
        </div>
        <div class="d-flex">
            <button class="btn btn-success flex-shrink-0 btn-lg" type="button" onclick="addToCartFromDetail(${productId})">
                <i class="bi-cart-fill me-2"></i>
                Agregar al carrito
            </button>
        </div>`;
    }

    /**
     * Crea el HTML completo del detalle del producto
     * Implementa Single Responsibility: Solo ensambla el HTML final
     * 
     * @param {Object} product - Objeto producto
     * @param {Object} detailSections - Secciones del detalle
     * @param {Object} stockInfo - Información de stock
     * @param {string} actionSection - Sección de acciones
     * @returns {string} HTML completo del detalle
     */
    function createDetailHTML(product, detailSections, stockInfo, actionSection) {
        return `
        <div class="row gx-4 gx-lg-5 align-items-center ${stockInfo.stockClass}">
            <div class="col-md-6">
                <img class="${stockInfo.imageClass}" src="${product.image}" alt="${product.name}" />
            </div>
            <div class="col-md-6">
                <div class="small mb-1">${product.category || 'Categoría'}</div>
                <h1 class="display-5 fw-bolder">${product.name}</h1>
                ${detailSections.discountBadge}
                ${detailSections.ratingSection}
                ${detailSections.priceSection}
                <p class="lead">${product.description || 'Descripción del producto no disponible.'}</p>
                ${stockInfo.stockSection}
                ${actionSection}
                ${detailSections.detailsSection}
                <div class="mt-4">
                    <a href="/" class="btn btn-secondary">
                        <i class="bi-arrow-left me-1"></i>
                        Volver a la tienda
                    </a>
                </div>
            </div>
        </div>`;
    }

    /**
     * Controlador para agregar productos al carrito desde la página de detalle
     * Implementa Single Responsibility: Solo maneja la lógica de agregar al carrito desde detalle
     * Implementa Liskov Substitution: Compatible con el sistema de carrito existente
     * 
     * @param {number} productId - ID del producto a agregar
     * @returns {void}
     */
function addToCartFromDetail(productId) {
        const quantityInput = getQuantityInput();
        const quantity = validateQuantity(quantityInput);

        if (!quantity) return;

        const product = findProductInCache(productId);
        if (!validateStock(product, quantity, quantityInput)) return;

        addToCart(productId, quantity);
        resetQuantityInput(quantityInput);
    }

    /**
     * Obtiene el input de cantidad de forma segura
     * Implementa Single Responsibility: Solo maneja la obtención del input
     * 
     * @returns {HTMLElement|null} Input de cantidad o null si no existe
     */
    function getQuantityInput() {
        return document.getElementById('inputQuantity');
    }

    /**
     * Valida y parsea la cantidad del input
     * Implementa Single Responsibility: Solo maneja la validación de cantidad
     * 
     * @param {HTMLElement} quantityInput - Input de cantidad
     * @returns {number|null} Cantidad válida o null si es inválida
     */
    function validateQuantity(quantityInput) {
        const quantity = parseInt(quantityInput?.value) || 1;

    if (quantity < 1) {
        alert('La cantidad debe ser mayor a 0');
            return null;
        }

        return quantity;
    }

    /**
     * Valida que la cantidad no exceda el stock disponible
     * Implementa Single Responsibility: Solo maneja la validación de stock
     * 
     * @param {Object} product - Producto a validar
     * @param {number} quantity - Cantidad solicitada
     * @param {HTMLElement} quantityInput - Input para corregir la cantidad
     * @returns {boolean} true si es válida, false si no
     */
    function validateStock(product, quantity, quantityInput) {
    if (product && quantity > product.stock) {
        alert(`Solo hay ${product.stock} unidades disponibles de este producto.`);
        quantityInput.value = product.stock;
            return false;
        }
        return true;
    }

    /**
     * Resetea el input de cantidad a 1
     * Implementa Single Responsibility: Solo maneja el reseteo del input
     * 
     * @param {HTMLElement} quantityInput - Input a resetear
     * @returns {void}
     */
    function resetQuantityInput(quantityInput) {
        if (quantityInput) {
    quantityInput.value = 1;
        }
    }

    /**
     * Servicio para contactar sobre productos sin stock
     * Implementa Single Responsibility: Solo maneja el contacto sobre productos
     * 
     * @param {number} productId - ID del producto sobre el que consultar
     * @returns {void}
     */
function contactForProduct(productId) {
        const product = findProductInCache(productId);
    if (product) {
            const message = `Has solicitado información sobre: ${product.name}\n\nTe contactaremos pronto para informarte sobre la disponibilidad de este producto.`;
            alert(message);
        }
    }

    /**
     * Controlador para agregar productos al carrito desde la página principal
     * Implementa Single Responsibility: Solo maneja la lógica de agregar al carrito desde lista
     * 
     * @param {number} productId - ID del producto a agregar
     * @returns {void}
     */
function addToCartFromMain(productId) {
    // Obtener la cantidad del input específico de esta card
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
    
    // Agregar al carrito con la cantidad especificada
    addToCart(productId, quantity);
    
    // Resetear la cantidad a 1 después de agregar
    if (quantityInput) {
        quantityInput.value = 1;
    }
}

/**
 * Actualiza la cantidad en el control de una card específica
 * Implementa Single Responsibility: Solo maneja el incremento/decremento en cards
 * 
 * @param {number} productId - ID del producto
 * @param {number} change - Valor a sumar o restar (+1 o -1)
 */
function updateCardQuantity(productId, change) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
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
    } else if (newValue > maxValue) {
        quantityInput.value = maxValue;
        showNotification(`Solo hay ${maxValue} unidades disponibles`, 'warning');
    }
}

/**
 * Valida la cantidad ingresada manualmente en una card
 * Implementa Single Responsibility: Solo maneja la validación de cantidad en cards
 * 
 * @param {number} productId - ID del producto
 */
function validateCardQuantity(productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    if (!quantityInput) return;
    
    const value = parseInt(quantityInput.value);
    const min = parseInt(quantityInput.min) || 1;
    const max = parseInt(quantityInput.max) || 999;
    
    if (isNaN(value) || value < min) {
        quantityInput.value = min;
    } else if (value > max) {
        quantityInput.value = max;
        showNotification(`Solo hay ${max} unidades disponibles`, 'warning');
    }
}

    /**
     * Función legacy para compatibilidad con el sistema de carrito existente
     * Implementa Interface Segregation: Mantiene compatibilidad sin afectar funcionalidad
     * 
     * @param {number} quantity - Cantidad (deprecated)
     * @returns {void}
     */
function updateCartCounter(quantity = 1) {
    // Esta función ahora está manejada por cart.js
        // Se mantiene por compatibilidad con código legacy
    }

    /**
     * Inicializador principal de la aplicación
     * Implementa Single Responsibility: Solo coordina la inicialización
     * Implementa Dependency Injection: Inyecta dependencias del sistema de carrito
     * 
     * @returns {void}
     */
    document.addEventListener('DOMContentLoaded', async function () {
        await initializeApplication();
    });

    /**
     * Inicializa todos los componentes de la aplicación
     * Implementa Single Responsibility: Solo maneja la inicialización completa
     * 
     * @returns {Promise<void>}
     */
    async function initializeApplication() {
    await loadProducts();
        initializeCartSystem();
        renderCurrentPage();
    }

    /**
     * Inicializa el sistema de carrito de forma compatible
     * Implementa Interface Segregation: Maneja diferentes implementaciones de carrito
     * 
     * @returns {void}
     */
    function initializeCartSystem() {
    if (typeof initializeCart === 'function') {
        initializeCart();
    } else if (typeof window.refreshCartCounter === 'function') {
        window.refreshCartCounter();
        }
    }

    /**
     * Renderiza la página actual según la ruta
     * Implementa Strategy Pattern: Diferentes estrategias según el tipo de página
     * 
     * @returns {void}
     */
    function renderCurrentPage() {
        const isDetailPage = isProductDetailPage();
    
    if (isDetailPage) {
        renderProductDetail();
    } else {
        renderProducts();
    }
    }

    /**
     * Determina si estamos en la página de detalle del producto
     * Implementa Single Responsibility: Solo determina el tipo de página
     * 
     * @returns {boolean} true si estamos en página de detalle
     */
    function isProductDetailPage() {
        return window.location.pathname.includes('item_detail');
    }