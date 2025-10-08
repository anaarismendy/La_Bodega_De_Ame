package com.proyecto1.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Configurar recursos estáticos para CSS y JS
        registry.addResourceHandler("/css/**")
                .addResourceLocations("classpath:/static/css/");
        
        registry.addResourceHandler("/js/**")
                .addResourceLocations("classpath:/static/js/");
        
        // Configurar recursos estáticos para imágenes
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/images/");
        
        // Configurar recursos estáticos para assets
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/assets/");
        
        // Configurar recursos estáticos para datos JSON
        registry.addResourceHandler("/data/**")
                .addResourceLocations("classpath:/data/");
        
        // IMPORTANTE: No configurar /factura/** como recurso estático
        // para evitar conflictos con el controlador de facturas
    }
}
