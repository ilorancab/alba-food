# Deploying Alba-Food on a Raspberry Pi (OMV)

This project is configured as a unified monolith (Spring Boot + React) to facilitate deployment on resource-constrained devices like a Raspberry Pi.

## 1. Setting Up the Build Environment (Buildx)

To build images that run on the Raspberry Pi (ARM) from an x86 PC, you need to configure a multi-platform builder. **You only need to do this once.**

```bash
# 1. Create a new multi-platform builder named 'mybuilder'
docker buildx create --name mybuilder --use

# 2. Start and bootstrap the builder
docker buildx inspect --bootstrap

# 3. (Optional) List builders to confirm 'mybuilder' is active (marked with *)
docker buildx ls
```

## 2. Building and First Deployment

Once the builder is configured, you can push the image to Docker Hub.

```bash
# Make sure you are logged in
docker login

# Build and push the image for both architectures (AMD64 and ARM64)
docker buildx build --platform linux/amd64,linux/arm64 \
  -t <DOCKER_HUB_USERNAME>/alba-food:latest --push .
```

## 3. Configuration on the Raspberry Pi (OMV / Portainer)

Create a new **Stack** in Portainer or a `docker-compose.yml` file on your Raspberry Pi with the following content.

**Important**: Adjust the `db` volume path to point to your data disk directory on OpenMediaVault (OMV).

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: alba-food-db
    environment:
      POSTGRES_DB: albafood
      POSTGRES_USER: <DB_USER>
      POSTGRES_PASSWORD: <DB_PASSWORD>
      # Configure your timezone for correct date handling
      TZ: Europe/Madrid
    # Port 5432 is not exposed for security; the app connects internally
    volumes:
      # CHANGE THIS PATH to your data disk directory in OMV
      - /srv/dev-disk-by-uuid-YOUR-DISK/appdata/alba-food/db:/var/lib/postgresql/data
    restart: unless-stopped

  app:
    image: <DOCKER_HUB_USERNAME>/alba-food:latest
    container_name: alba-food-app
    # Prevent permission issues in OMV by running as your local user
    user: "${PUID:-1000}:${PGID:-1000}"
    ports:
      - "8080:8080"
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: albafood
      DB_USER: <DB_USER>
      DB_PASSWORD: <DB_PASSWORD>
      TZ: Europe/Madrid
      BABY_NAME: Alba # Change this to configure your baby's name!
      # Memory optimization for Raspberry Pi
      JAVA_OPTS: "-Xmx512m -Xms256m"
    depends_on:
      - db
    restart: unless-stopped
```

## 4. Access

Once deployed, the application will be available at:
`http://<YOUR-RASPBERRY-IP>:8080`

## 5. Maintenance and Updates

Each time you make changes to the code (Frontend or Backend), follow these steps to update your Raspberry Pi:

### Step A: Push a new version (From your PC)
If you restarted your PC or changed terminals, ensure you are using the correct builder:

```bash
# 1. Select the multi-platform builder
docker buildx use mybuilder

# 2. Build and push the changes
docker buildx build --platform linux/amd64,linux/arm64 \
  -t <DOCKER_HUB_USERNAME>/alba-food:latest --push .
```

### Step B: Update the Raspberry Pi (OMV/Portainer)
To pull the new version on the Raspberry Pi:

1. Go to **Portainer** > **Stacks** > **alba-food**.
2. Click on the **Editor** tab.
3. Click the **Update the stack** button.
4. **IMPORTANT**: Toggle the **"Re-pull image"** switch before confirming.

If you are using the SSH terminal instead, run:
```bash
docker compose pull
docker compose up -d
```
