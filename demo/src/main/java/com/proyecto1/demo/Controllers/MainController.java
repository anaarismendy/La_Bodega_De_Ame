package com.proyecto1.demo.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/")
    public String index() {
        return "index";
    }
    
    @GetMapping("/index")
    public String indexPage() {
        return "index";
    }
}
