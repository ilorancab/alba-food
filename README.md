# Alba-Food

A baby feeding tracking application.

## Architecture
- **Unified Monolith**: Spring Boot (Java 17) + React 19.
- **Database**: PostgreSQL.
- **Frontend**: Embedded in the backend as static resources for simple, unified deployment.

## Documentation
- [Deployment Instructions (Raspberry Pi / OMV)](DEPLOY.md)

## Local Development
1. Ensure you have a running PostgreSQL database available.
2. Run `mvn spring-boot:run` (or `./mvnw spring-boot:run` if the wrapper is available). This will automatically compile and package the frontend as well.
3. Access the app at `http://localhost:8080`.
