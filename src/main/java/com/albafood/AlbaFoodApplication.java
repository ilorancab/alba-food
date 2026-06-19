package com.albafood;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.albafood.config.FoodProperties;

@SpringBootApplication
@EnableConfigurationProperties(FoodProperties.class)
public class AlbaFoodApplication {
    public static void main(String[] args) {
        SpringApplication.run(AlbaFoodApplication.class, args);
    }
}
