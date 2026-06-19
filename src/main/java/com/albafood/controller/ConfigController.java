package com.albafood.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    @Value("${app.baby-name:Alba}")
    private String babyName;

    @GetMapping
    public Map<String, String> getConfig() {
        return Map.of("babyName", babyName);
    }
}
