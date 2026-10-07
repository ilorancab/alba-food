# syntax=docker/dockerfile:1

# --- Stage 1: npm dependencies (re-runs only when package.json/lock change) ---
FROM node:22.12.0-bookworm-slim AS frontend-deps
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# --- Stage 2: build the unified jar (React + Spring Boot) ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .

# node_modules comes from the previous stage; the later `COPY frontend`
# does not overwrite it (it is excluded from the build context)
COPY --from=frontend-deps /frontend/node_modules ./frontend/node_modules
COPY frontend/package.json frontend/package-lock.json ./frontend/

COPY src ./src
COPY frontend ./frontend

# .m2        -> Maven dependencies and plugins
# .npm       -> npm downloads (npm install run by frontend-maven-plugin)
# target/node -> Node binary installed by frontend-maven-plugin
RUN --mount=type=cache,target=/root/.m2 \
    --mount=type=cache,target=/root/.npm \
    --mount=type=cache,target=/app/target/node \
    mvn -B package -DskipTests

# --- Stage 3: runtime ---
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-XX:TieredStopAtLevel=1", "-jar", "app.jar"]
