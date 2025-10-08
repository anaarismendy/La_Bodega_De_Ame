package com.proyecto1.demo.Controllers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicReference;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto1.demo.Models.DAO.ClienteDAO;
import com.proyecto1.demo.Models.DAO.Factura_DetallesDAO;
import com.proyecto1.demo.Models.DAO.Factura_EncabezadoDAO;
import com.proyecto1.demo.Models.DAO.ProductoDAO;
import com.proyecto1.demo.Models.Entity.Carrito;
import com.proyecto1.demo.Models.Entity.Cliente;
import com.proyecto1.demo.Models.Entity.Factura_Detalles;
import com.proyecto1.demo.Models.Entity.Factura_Encabezado;
import com.proyecto1.demo.Models.Entity.Producto;

// DTO para recibir datos de factura
class FacturaRequest {
    private Cliente cliente;
    private List<Carrito> carrito;
    
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public List<Carrito> getCarrito() { return carrito; }
    public void setCarrito(List<Carrito> carrito) { this.carrito = carrito; }
}

@RestController
@RequestMapping("/api/facturas")
@CrossOrigin(origins = "*")
public class FacturaController {

    private static final Logger logger = LoggerFactory.getLogger(FacturaController.class);

    @Autowired
    private Factura_DetallesDAO facturaDetallesDAO;
    
    @Autowired
    private Factura_EncabezadoDAO facturaEncabezadoDAO;
    
    @Autowired
    private ProductoDAO productoDAO;
    
    @Autowired
    private ClienteDAO clienteDAO; // Usado implícitamente a través de relaciones JPA

    @PostMapping
    public ResponseEntity<Factura_Encabezado> saveFactura(@RequestBody FacturaRequest request) {
        
        Cliente cliente = request.getCliente();
        List<Carrito> carrito = request.getCarrito();
        
        logger.info("Iniciando creación de factura para cliente: {}", cliente.getClienteId());
        
        try {
            AtomicReference<BigDecimal> subTotalFactura = new AtomicReference<>(BigDecimal.ZERO);
            AtomicReference<BigDecimal> descuentoFactura = new AtomicReference<>(BigDecimal.ZERO);
            String numeroFactura = GenerarNumeroFactura();

            logger.info("Número de factura generado: {}", numeroFactura);

            // Verificar si el cliente existe, si no, crearlo
            Cliente clienteExistente = clienteDAO.findById(cliente.getClienteId());
            if (clienteExistente == null) {
                logger.info("Cliente no existe, creando nuevo cliente: {}", cliente.getClienteId());
                clienteDAO.save(cliente);
                clienteExistente = cliente;
            } else {
                logger.info("Cliente ya existe, usando cliente existente: {}", cliente.getClienteId());
                clienteExistente = cliente;
            }

            // Primero guardar la factura encabezado para obtener el ID
            Factura_Encabezado facturaEncabezado = new Factura_Encabezado();
            facturaEncabezado.setNumeroFactura(numeroFactura);
            facturaEncabezado.setFechaEmision(LocalDate.now());
            facturaEncabezado.setCliente(clienteExistente);
            facturaEncabezado.setEstado("PENDIENTE");
            
            facturaEncabezadoDAO.guardar(facturaEncabezado);

            carrito.forEach(item -> {
            logger.info("Procesando item del carrito: cantidad={}, producto={}", 
                       item.getCantidad(), item.getProducto());
            
            if (item.getProducto() == null) {
                logger.error("Producto es null en el carrito para el item: {}", item.getId());
                return;
            }
            
            Producto producto = productoDAO.findById(item.getProducto().getProductoId());
            if (producto == null) {
                logger.error("Producto no encontrado con ID: {}", item.getProducto().getProductoId());
                return;
            }
            
            BigDecimal descuento = BigDecimal.valueOf(producto.getDescuento() != null ? producto.getDescuento() : 0.0);
            BigDecimal precioUnitario = BigDecimal.valueOf(producto.getPrecio());
            
            // Usar métodos de cálculo específicos
            BigDecimal subtotalProducto = calcularSubtotalProducto(item.getCantidad(), precioUnitario);
            BigDecimal subtotalConDescuento = calcularSubtotalConDescuento(subtotalProducto, descuento);
            
            Factura_Detalles facturaDetalles = new Factura_Detalles(
                    item.getCantidad(),
                    precioUnitario,
                    descuento,
                    facturaEncabezado,
                    producto);

            subTotalFactura.updateAndGet(current -> current.add(subtotalConDescuento));
            descuentoFactura.updateAndGet(current -> current.add(descuento));

            facturaDetallesDAO.guardar(facturaDetalles);
        });

            // Actualizar la factura con los totales calculados usando métodos específicos
            BigDecimal impuestoFactura = calcularImpuesto(subTotalFactura.get());
            BigDecimal totalFactura = calcularTotalFinal(subTotalFactura.get(), descuentoFactura.get(), impuestoFactura);

        facturaEncabezado.setSubtotal(subTotalFactura.get());
        facturaEncabezado.setDescuento(descuentoFactura.get());
        facturaEncabezado.setImpuesto(impuestoFactura);
        facturaEncabezado.setTotal(totalFactura);
        facturaEncabezado.setEstado("PAGADA");
        facturaEncabezado.setMetodoPago("Pago en linea");
        facturaEncabezado.setObservaciones("Factura generada");

            facturaEncabezadoDAO.guardar(facturaEncabezado);
            
            logger.info("Factura creada exitosamente con ID: {}", facturaEncabezado.getFactura_id());
            
            // Retornar la factura con la URL de redirección
            facturaEncabezado.setObservaciones("Factura generada - Redirigir a: /factura/" + facturaEncabezado.getFactura_id());
            return ResponseEntity.ok(facturaEncabezado);
            
        } catch (Exception e) {
            logger.error("Error al crear factura para cliente {}: {}", cliente.getClienteId(), e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }


    /**
     * Obtiene una factura por ID en formato JSON (API REST)
     * GET /api/facturas/{facturaId}
     */
    @GetMapping("/{facturaId}")
    public ResponseEntity<Factura_Encabezado> obtenerFactura(@PathVariable Long facturaId) {
        logger.info("Solicitando factura con ID: {}", facturaId);
        
        try {
            Factura_Encabezado factura = facturaEncabezadoDAO.encontrarPorId(facturaId);
            if (factura != null) {
                logger.info("Factura encontrada: {}", factura.getNumeroFactura());
                return ResponseEntity.ok(factura);
            } else {
                logger.warn("Factura no encontrada con ID: {}", facturaId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error al obtener factura {}: {}", facturaId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtiene todas las facturas (API REST)
     * GET /api/facturas
     */
    @GetMapping
    public ResponseEntity<List<Factura_Encabezado>> obtenerTodasFacturas() {
        logger.info("Solicitando todas las facturas");
        
        try {
            List<Factura_Encabezado> facturas = facturaEncabezadoDAO.encontrarTodos();
            logger.info("Se encontraron {} facturas", facturas.size());
            return ResponseEntity.ok(facturas);
        } catch (Exception e) {
            logger.error("Error al obtener facturas: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Obtiene facturas por cliente (API REST)
     * GET /api/facturas/cliente/{clienteId}
     */
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Factura_Encabezado>> obtenerFacturasPorCliente(@PathVariable Long clienteId) {
        logger.info("Solicitando facturas para cliente: {}", clienteId);
        
        try {
            List<Factura_Encabezado> facturas = facturaEncabezadoDAO.encontrarPorCliente(clienteId);
            logger.info("Se encontraron {} facturas para el cliente {}", facturas.size(), clienteId);
            return ResponseEntity.ok(facturas);
        } catch (Exception e) {
            logger.error("Error al obtener facturas para cliente {}: {}", clienteId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Calcula el subtotal real por producto (cantidad * precio_unitario)
     */
    private BigDecimal calcularSubtotalProducto(Integer cantidad, BigDecimal precioUnitario) {
        return precioUnitario.multiply(new BigDecimal(cantidad));
    }

    /**
     * Calcula el subtotal con descuento aplicado
     */
    private BigDecimal calcularSubtotalConDescuento(BigDecimal subtotalSinDescuento, BigDecimal descuento) {
        return subtotalSinDescuento.subtract(descuento);
    }

    /**
     * Calcula el impuesto sobre el subtotal general
     */
    private BigDecimal calcularImpuesto(BigDecimal subtotalGeneral) {
        return BigDecimal.valueOf(0.19).multiply(subtotalGeneral);
    }

    /**
     * Calcula el total final (subtotal - descuento + impuesto)
     */
    private BigDecimal calcularTotalFinal(BigDecimal subtotalGeneral, BigDecimal descuentoGeneral, BigDecimal impuesto) {
        return subtotalGeneral.subtract(descuentoGeneral).add(impuesto);
    }


    private String GenerarNumeroFactura() {
        Random random = new Random();
        String alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            result.append(alphanumeric.charAt(random.nextInt(alphanumeric.length())));
        }
        return "FAC-" + LocalDate.now().getYear() + "-" + LocalDate.now().getMonthValue() + "-"
                + LocalDate.now().getDayOfMonth() + "-" + result.toString();
    }
}
