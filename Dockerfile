FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the pom.xml and the frontend directory to cache dependencies
COPY pom.xml .
COPY frontend/package*.json ./frontend/

# Copy the source code
COPY src ./src
COPY frontend ./frontend

# Build both frontend and backend
# This will trigger frontend-maven-plugin to build React and then Spring Boot jar
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-XX:TieredStopAtLevel=1", "-jar", "app.jar"]
