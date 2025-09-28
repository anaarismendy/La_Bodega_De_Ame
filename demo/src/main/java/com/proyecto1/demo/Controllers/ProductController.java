package com.proyecto1.demo.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ProductController {

    @GetMapping("/item_detail")
    public String itemDetail(@RequestParam(required = false) String id) {
        return "item_detail";
    }
    
    @GetMapping("/item_detail.html")
    public String itemDetailHtml(@RequestParam(required = false) String id) {
        return "item_detail";
    }
}
