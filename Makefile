IMAGE     ?= ilbravo/alba-food
PLATFORMS ?= linux/amd64,linux/arm64
BUILDER   ?= mybuilder

.DEFAULT_GOAL := help

.PHONY: help release up down db build logs run

help: ## Muestra esta ayuda
	@grep -E '^[a-z-]+:.*##' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-8s\033[0m %s\n", $$1, $$2}'

release: ## Build multi-arch (amd64+arm64) y sube :latest a Docker Hub
	@git diff --quiet || echo "AVISO: hay cambios sin commitear, NO se incluiran en la imagen"
	docker buildx use $(BUILDER)
	docker buildx build --platform $(PLATFORMS) -t $(IMAGE):latest --push .

up: ## Arranca el stack local (app + postgres) en :8080
	docker compose up -d --build

down: ## Para y elimina los contenedores locales (los datos de postgres se quedan)
	docker compose down

db: ## Arranca solo la postgres local (:5432)
	docker compose up -d db

build: ## Construye la imagen local sin arrancar nada
	docker compose build

logs: ## Sigue los logs de la app local
	docker compose logs -f app

run: db ## Arranca la app con Maven en local (necesita el puerto 8080 libre: make down)
	mvn spring-boot:run
