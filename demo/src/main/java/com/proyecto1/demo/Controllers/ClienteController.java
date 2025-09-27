package com.proyecto1.demo.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.proyecto1.demo.Models.Entity.DAO.ClienteDAO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.proyecto1.demo.Models.Entity.Cliente;



@Controller
@RequestMapping("/clientes")
public class ClienteController {

    @Autowired
    private ClienteDAO clienteDAO;

    @GetMapping
    public String getAllClients(Model model) {
        model.addAttribute("clientes", clienteDAO.findAll());
        return "clientes/list";
    }

    @GetMapping("/new-client")
    public String getNewClientForm(Model model) {
        model.addAttribute("cliente", new Cliente());

        return "clientes/form";
    }
    
    @PostMapping("/save")
    public String saveClient(@ModelAttribute("cliente") Cliente cliente) {
        clienteDAO.save(cliente);
        return "redirect:/clientes";
    }

    @GetMapping("/edit/{id}")
    public String getEditClientForm(@PathVariable Long id, Model model) {
        model.addAttribute("cliente", clienteDAO.findById(id));
        return "clientes/form";
    }

    @PostMapping("/update/{id}")
    public String updateClient(@PathVariable Long id, @ModelAttribute("cliente") Cliente cliente) {
        clienteDAO.update(id, cliente);
        return "redirect:/clientes";
    }

    @GetMapping("/delete/{id}")
    public String deleteClient(@PathVariable Long id) {
        clienteDAO.delete(id);
        return "redirect:/clientes";
    }
}
