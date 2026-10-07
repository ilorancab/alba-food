# Alba-Food

A baby feeding tracking application.

## Architecture
- **Unified Monolith**: Spring Boot (Java 21) + React 19.
- **Database**: PostgreSQL.
- **Frontend**: Embedded in the backend as static resources for simple, unified deployment.

## Commands
Run `make help` to list every target. The useful ones:

- `make up` – local stack (PostgreSQL + app) on http://localhost:8080
- `make down` – stop it (database data is kept)
- `make run` – run the app with Maven (starts PostgreSQL first; needs port 8080 free)
- `make release` – build the multi-arch image and push `:latest` to Docker Hub

## Documentation
- [Deployment Instructions (Raspberry Pi / OMV)](DEPLOY.md)

## Local Development
Pick one:

1. **Docker**: `make up` → http://localhost:8080 (`make logs` to follow the logs).
2. **Maven**: `make down` first (frees port 8080), then `make run` → http://localhost:8080.
   This compiles and packages the frontend as well.
