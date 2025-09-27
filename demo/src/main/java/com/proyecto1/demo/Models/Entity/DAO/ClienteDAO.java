package com.proyecto1.demo.Models.Entity.DAO;
import com.proyecto1.demo.Models.Entity.Cliente;
import java.util.List;


public interface ClienteDAO {
	List<Cliente> findAll();
	Cliente findById(Long id);
	void save(Cliente cliente);
	void update(Long id, Cliente cliente);
	void delete(Long id);
}


