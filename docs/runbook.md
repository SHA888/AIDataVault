# AIDataVault Operational Runbook (Local Docker Environment)

This runbook provides procedures for common operational tasks when running the AIDataVault application locally using Docker Compose. All commands are expected to be run from the root directory of the project (`/home/kd/AIDataVault`).

## Table of Contents
1. [Starting the Application](#1-starting-the-application)
2. [Stopping the Application](#2-stopping-the-application)
3. [Viewing Logs](#3-viewing-logs)
    - [All Services](#all-services)
    - [Specific Service](#specific-service)
4. [Rebuilding Services](#4-rebuilding-services)
5. [Accessing the PostgreSQL Database](#5-accessing-the-postgresql-database)
6. [Troubleshooting Common Issues](#6-troubleshooting-common-issues)
    - [Port Conflicts](#port-conflicts)
    - [Database Connection Errors](#database-connection-errors)
    - [Service Fails to Start](#service-fails-to-start)

---

## 1. Starting the Application

To start all services defined in `docker-compose.yml` (the application server and the database) in detached mode (running in the background):

```bash
docker compose up -d
```

To start and build (or rebuild) images if they don't exist or if `Dockerfile` or related files have changed:

```bash
docker compose up --build -d
```

If you want to see the logs directly in your terminal (attached mode), omit the `-d` flag:

```bash
docker compose up --build
```

---

## 2. Stopping the Application

To stop all running services defined in `docker-compose.yml`:

```bash
docker compose down
```

This command stops and removes the containers. If you also want to remove the volumes (which includes the PostgreSQL database data), use:

```bash
docker compose down -v
```
**Caution:** Using `-v` will delete your database data unless you have external backups.

---

## 3. Viewing Logs

### All Services
To view the aggregated logs from all running services:

```bash
docker compose logs
```

To follow the logs in real-time:

```bash
docker compose logs -f
```

To see logs from a certain point in time, e.g., the last 10 minutes:
```bash
docker compose logs --since 10m
```

### Specific Service
To view logs for a specific service (e.g., `app` or `db`):

```bash
docker compose logs <service_name>
# Example for the application server:
docker compose logs app
# Example for the database:
docker compose logs db
```

To follow logs for a specific service:
```bash
docker compose logs -f <service_name>
# Example:
docker compose logs -f app
```

---

## 4. Rebuilding Services

If you've made changes to the source code that requires a rebuild of the Docker image (e.g., changes to `Dockerfile`, or application code that is copied into the image during build), you need to rebuild the service.

To rebuild all services:
```bash
docker compose build
```

To rebuild a specific service:
```bash
docker compose build <service_name>
# Example:
docker compose build app
```

After rebuilding, you'll need to restart the services to use the new image:
```bash
docker compose up -d --force-recreate --no-deps <service_name> # To restart a specific service
# Or simply
docker compose up -d --build # To rebuild and restart all necessary services
```

---

## 5. Accessing the PostgreSQL Database

To connect to the PostgreSQL database directly using `psql` from within the `db` container:

1.  First, find the name of your running database container (usually `aidatavault-db-1` or similar):
    ```bash
    docker ps
    ```

2.  Execute `psql` inside the container:
    ```bash
    docker exec -it <db_container_name_or_id> psql -U <username> -d <database_name>
    ```
    Replace `<db_container_name_or_id>` with the actual container name/ID from `docker ps`.
    The `<username>` and `<database_name>` are those defined in your `docker-compose.yml` and `.env` file for PostgreSQL (e.g., `aidatavault_user` and `aidatavault_db`).

    Example:
    ```bash
    docker exec -it aidatavault-db-1 psql -U aidatavault_user -d aidatavault_db
    ```
    You will be prompted for the password (`aidatavault_password`).


---

## 6. Troubleshooting Common Issues

### Port Conflicts
-   **Symptom:** `docker compose up` fails with an error like "port is already allocated" or "bind: address already in use".
-   **Cause:** Another application on your host machine is using the port that Docker is trying to map (e.g., port 3001 for the app, or 5432 if you were trying to map the DB port directly).
-   **Solution:**
    1.  Identify the process using the port. On Linux/macOS: `sudo lsof -i :<port_number>`. On Windows: `netstat -ano | findstr :<port_number>`.
    2.  Stop the conflicting application or change the port mapping in your `docker-compose.yml` (e.g., map to `3002:3001` instead of `3001:3001`).

### Database Connection Errors
-   **Symptom:** Application logs show errors like "ECONNREFUSED", "database does not exist", "password authentication failed".
-   **Cause & Solution:**
    1.  **Service Name:** Ensure `DB_HOST` in your application's environment (or the hostname in `DATABASE_URL`) is set to the Docker service name for the database (e.g., `db`).
    2.  **Credentials/DB Name:** Double-check `DB_USER`, `DB_PASSWORD`, `DB_NAME` (or the components in `DATABASE_URL`) in your application's environment match those used to initialize the PostgreSQL container (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` in `docker-compose.yml`).
    3.  **Database Ready:** Ensure the `db` service is fully up and running before the `app` service tries to connect. The `depends_on` with `service_healthy` condition in `docker-compose.yml` should handle this. Check `docker compose logs db` for messages like "database system is ready to accept connections".
    4.  **Network Issues:** Rarely, Docker networking might have issues. `docker compose down` and then `docker compose up` can sometimes resolve transient network issues. Ensure you haven't set `network_mode: bridge` for the app service, as this isolates it from the Docker Compose default network.

### Service Fails to Start
-   **Symptom:** A service (e.g., `app`) exits immediately or enters a restart loop.
-   **Cause & Solution:**
    1.  Check the logs for that specific service: `docker compose logs <service_name>`. The error message is usually there.
    2.  **Application Error:** There might be a bug in your application code that prevents it from starting (e.g., a missing dependency, a syntax error, a critical misconfiguration).
    3.  **Dockerfile/Build Issues:** If it's a custom-built image, there might be an error in the `Dockerfile` or the build process. Try rebuilding with `docker compose build <service_name>`.
    4.  **Resource Issues:** Unlikely in a local setup unless your machine is very constrained.

This runbook provides a starting point. As the project evolves, more specific operational procedures can be added.
