package com.albafood.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "app.food")
public class FoodProperties {

    private List<String> stopWords = List.of("con", "y", "e", "de", "en", "sin", "la", "el", "los", "las", "un", "una", "al", "del", "su");
    private List<String> prefixes = List.of("pure de ", "puré de ", "crema de ", "tritura de ", "papilla de ", "triturado de ");

    public List<String> getStopWords() { return stopWords; }
    public void setStopWords(List<String> stopWords) { this.stopWords = stopWords; }

    public List<String> getPrefixes() { return prefixes; }
    public void setPrefixes(List<String> prefixes) { this.prefixes = prefixes; }
}
