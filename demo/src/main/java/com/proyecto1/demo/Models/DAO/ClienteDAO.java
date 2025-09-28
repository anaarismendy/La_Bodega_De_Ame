package com.proyecto1.demo.Models.DAO;

import java.util.List;
import com.proyecto1.demo.Models.Entity.Cliente;

public interface ClienteDAO {
    List<Cliente> encontrarTodos();
    Cliente encontrarPorId(Long id);
    Cliente encontrarPorEmail(String email);
    List<Cliente> encontrarPorEstado(Boolean estado);
    void guardar(Cliente cliente);
    void actualizar(Cliente cliente);
    void eliminar(Long id);
}

