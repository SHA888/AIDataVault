# AIDataVault Disaster Recovery Procedures (Local Docker Environment)

This document outlines basic disaster recovery procedures for the AIDataVault application when running in a local Docker Compose environment. The primary focus is on recovering data, code, and configuration.

## Table of Contents
1. [Overview](#1-overview)
2. [Code Recovery](#2-code-recovery)
3. [Configuration Recovery](#3-configuration-recovery)
4. [Database (PostgreSQL) Data Recovery](#4-database-postgresql-data-recovery)
    - [Identifying the Docker Volume](#identifying-the-docker-volume)
    - [Backing Up the Database Volume/Data](#backing-up-the-database-volumedata)
        - [Option 1: Using `pg_dump` (Recommended for Portability)](#option-1-using-pg_dump-recommended-for-portability)
        - [Option 2: Backing Up the Raw Volume Data (More Complex)](#option-2-backing-up-the-raw-volume-data-more-complex)
    - [Restoring the Database](#restoring-the-database)
        - [Restoring from a `pg_dump` Backup](#restoring-from-a-pg_dump-backup)
        - [Restoring Raw Volume Data (If backed up this way)](#restoring-raw-volume-data-if-backed-up-this-way)
5. [Full System Re-creation](#5-full-system-re-creation)

---

## 1. Overview

In a local development context, "disaster" usually means accidental data deletion, corruption, or machine failure. The goal is to restore the development environment to a working state with minimal data loss.

Key components to recover:
-   **Source Code:** Managed by Git.
-   **Configuration Files:** Especially `/server/.env`.
-   **Database Data:** Stored in a Docker volume by the PostgreSQL service.

---

## 2. Code Recovery

-   **Source:** The primary source for code recovery is the Git repository.
-   **Procedure:**
    1.  Ensure you have recently pushed your changes to a remote repository (e.g., GitHub).
    2.  If your local copy is lost or corrupted, re-clone the repository:
        ```bash
        git clone https://github.com/yourusername/ai-datavault.git # Replace with actual URL
        cd ai-datavault
        ```
    3.  If you need to revert to a previous stable state, use Git commands like `git checkout <commit-hash>` or `git reset`.

---

## 3. Configuration Recovery

-   **Key File:** `/server/.env` contains critical environment variables.
-   **Prevention:** While `/server/.env` (with actual secrets) should NOT be committed to Git, the template `/server/.env.example` IS version-controlled.
-   **Procedure:**
    1.  If `/server/.env` is lost, recreate it by copying from the example:
        ```bash
        cd server
        cp .env.example .env
        ```
    2.  Manually re-populate the necessary secret values (database passwords, JWT secret, API keys) in `/server/.env`. It's good practice to keep a secure, offline copy of these values if they are complex and hard to regenerate.

---

## 4. Database (PostgreSQL) Data Recovery

This is often the most critical part of local disaster recovery.

### Identifying the Docker Volume

Docker Compose typically creates a named volume for your PostgreSQL data. The name is usually prefixed with your project directory name.

1.  Check your `docker-compose.yml`. The `db` service will have a `volumes` section, often like:
    ```yaml
    services:
      db:
        # ... other settings
        volumes:
          - postgres_data:/var/lib/postgresql/data
    # ... (at the bottom of the file)
    volumes:
      postgres_data: # This defines a named volume
    ```
    Here, `postgres_data` is the logical name. Docker will create a volume like `aidatavault_postgres_data` (if your project folder is `aidatavault`).

2.  List Docker volumes to find the exact name:
    ```bash
    docker volume ls
    ```
    Look for a volume associated with your project and the PostgreSQL service.

### Backing Up the Database Volume/Data

#### Option 1: Using `pg_dump` (Recommended for Portability)

This method creates a SQL dump file, which is generally easier to restore across different PostgreSQL versions or setups.

1.  Ensure your Docker Compose services are running (`docker compose up -d`).
2.  Execute `pg_dump` from within the running `db` container:
    ```bash
    docker compose exec -T db pg_dump -U <DB_USER> -d <DB_NAME> > backup_$(date +%Y%m%d_%H%M%S).sql
    ```
    Replace `<DB_USER>` and `<DB_NAME>` with your actual database user and name (e.g., `aidatavault_user`, `aidatavault_db`).
    -   The `-T` flag for `docker compose exec` is important when redirecting output.
    -   This command saves the backup to a file (e.g., `backup_20231027_143000.sql`) in your current host directory.
    -   You will be prompted for the `<DB_USER>`'s password.

    To avoid the password prompt, you can temporarily set the `PGPASSWORD` environment variable for the command (use with caution):
    ```bash
    docker compose exec -T -e PGPASSWORD=<DB_PASSWORD> db pg_dump -U <DB_USER> -d <DB_NAME> > backup_$(date +%Y%m%d_%H%M%S).sql
    ```

#### Option 2: Backing Up the Raw Volume Data (More Complex)

This involves stopping the database and copying the volume data. It can be faster for very large databases but is less portable.

1.  Stop your services: `docker compose down` (do NOT use `-v` here yet).
2.  Find the mountpoint of your Docker volume on the host system:
    ```bash
    docker volume inspect <your_project_postgres_data_volume_name>
    # Example: docker volume inspect aidatavault_postgres_data
    ```
    This will output JSON including a `Mountpoint` path (e.g., `/var/lib/docker/volumes/aidatavault_postgres_data/_data`).
3.  Copy the data from this mountpoint to a backup location (requires sudo):
    ```bash
    sudo cp -a /var/lib/docker/volumes/aidatavault_postgres_data/_data /path/to/your/backup_location/
    ```

### Restoring the Database

#### Restoring from a `pg_dump` Backup

1.  Ensure your Docker Compose services are running, especially the `db` service (`docker compose up -d db`).
2.  If restoring to a fresh database, you might want to drop and recreate it first, or ensure the target DB is empty. If the database or tables already exist, `psql` might throw errors unless your dump file includes `DROP TABLE` statements or you handle it manually.
3.  Execute `psql` to import the dump:
    ```bash
    cat your_backup_file.sql | docker compose exec -T db psql -U <DB_USER> -d <DB_NAME>
    ```
    Replace `your_backup_file.sql`, `<DB_USER>`, and `<DB_NAME>` appropriately.
    You will be prompted for the password.

    Or using `PGPASSWORD`:
    ```bash
    cat your_backup_file.sql | docker compose exec -T -e PGPASSWORD=<DB_PASSWORD> db psql -U <DB_USER> -d <DB_NAME>
    ```

#### Restoring Raw Volume Data (If backed up this way)

1.  Ensure services are stopped: `docker compose down`.
2.  If the volume still exists but is corrupted, remove it: `docker volume rm <your_project_postgres_data_volume_name>`.
3.  Recreate the (empty) volume implicitly by starting the db service, or explicitly: `docker volume create <your_project_postgres_data_volume_name>`.
4.  Find its new mountpoint: `docker volume inspect <your_project_postgres_data_volume_name>`.
5.  Copy your backed-up data to this new mountpoint (requires sudo):
    ```bash
    sudo cp -a /path/to/your/backup_location/_data/* /var/lib/docker/volumes/<your_project_postgres_data_volume_name>/_data/
    ```
6.  Ensure file permissions are correct for the PostgreSQL user within the container. This can be tricky and is a downside of raw volume backups.
7.  Start services: `docker compose up -d`.

---

## 5. Full System Re-creation

If everything is lost on your machine:

1.  Set up your machine with Git, Docker, and Docker Compose.
2.  Clone the code from the remote repository (Step 2).
3.  Recreate `/server/.env` from `/server/.env.example` and populate secrets (Step 3).
4.  If you have a database backup (`.sql` file), start the Docker services (`docker compose up -d`).
5.  Restore the database using the `pg_dump` restore method (Step 4).

Regularly backing up your `pg_dump` SQL file and securely storing your `.env` secrets are the most crucial steps for local development disaster recovery.
