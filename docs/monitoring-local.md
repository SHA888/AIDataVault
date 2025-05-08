# AIDataVault Monitoring (Local Docker Environment)

This document describes basic monitoring practices for the AIDataVault application when running in a local Docker Compose environment. In this context, "monitoring" primarily refers to observing logs and basic system health.

## Table of Contents
1. [Overview](#1-overview)
2. [Accessing Logs](#2-accessing-logs)
    - [Viewing All Service Logs](#viewing-all-service-logs)
    - [Viewing Specific Service Logs](#viewing-specific-service-logs)
    - [Following Logs in Real-time](#following-logs-in-real-time)
    - [Filtering Logs (e.g., by time)](#filtering-logs-eg-by-time)
3. [Interpreting Common Log Messages](#3-interpreting-common-log-messages)
    - [Application Service (`app`) Logs](#application-service-app-logs)
    - [Database Service (`db`) Logs](#database-service-db-logs)
4. [Basic Troubleshooting Based on Logs](#4-basic-troubleshooting-based-on-logs)
5. [Host System Resource Monitoring](#5-host-system-resource-monitoring)

---

## 1. Overview

For local development, formal monitoring dashboards and alerting systems are typically not employed. Instead, developers rely on direct observation of service logs and the application's behavior to identify issues.

The primary tool for monitoring is `docker compose logs`.

---

## 2. Accessing Logs

All `docker compose` commands should be run from the root directory of the project.

### Viewing All Service Logs

To see an aggregated stream of logs from all running services (e.g., `app` and `db`):

```bash
docker compose logs
```

### Viewing Specific Service Logs

To view logs from only one service:

-   **Application Server (`app`):**
    ```bash
    docker compose logs app
    ```
-   **Database Server (`db`):**
    ```bash
    docker compose logs db
    ```

### Following Logs in Real-time

To see new log messages as they are generated (live tailing):

-   **All Services:**
    ```bash
    docker compose logs -f
    # or
    docker compose logs --follow
    ```
-   **Specific Service (e.g., `app`):**
    ```bash
    docker compose logs -f app
    ```

### Filtering Logs (e.g., by time)

To see logs since a certain time or for a specific duration:

-   **Last N lines (e.g., 100 lines):**
    ```bash
    docker compose logs --tail=100 app
    ```
-   **Since a specific time (e.g., last 10 minutes):**
    ```bash
    docker compose logs --since 10m app
    ```
    (Use formats like `2023-10-27T10:00:00` or relative times like `1h30m`)

---

## 3. Interpreting Common Log Messages

### Application Service (`app`) Logs

-   **Successful Startup:** Look for messages indicating the server has started and is listening on the configured port (e.g., `Server listening on port 3001`).
-   **Database Connection:** 
    -   Success: `Database connection has been established successfully.`
    -   Failure: `Database operation failed:`, followed by detailed error messages (e.g., `ECONNREFUSED`, `password authentication failed`, `database "..." does not exist`). The `Detailed connection error object` we added in `server/src/index.js` will be very helpful here.
-   **API Requests:** Depending on your logging middleware (e.g., Morgan, if used), you might see incoming HTTP requests, their methods, paths, status codes, and response times.
-   **Errors:** Stack traces or error messages for unhandled exceptions, validation errors, etc. (e.g., `Login error:`, `Registration error:`, `Profile route error:`).

### Database Service (`db`) Logs

-   **Successful Startup:** `database system is ready to accept connections`.
-   **Connection Attempts:** Logs showing connections from the `app` service.
-   **Queries:** If query logging is enabled in PostgreSQL, you might see SQL queries being executed.
-   **Errors:** Database-level errors (e.g., syntax errors in SQL if raw queries were used, permission issues, disk space issues - though less common locally).

---

## 4. Basic Troubleshooting Based on Logs

-   **Service Fails to Start / Restart Loop:** Immediately check `docker compose logs <service_name>` for the error message causing the failure. This is the most common first step.
-   **Application Not Responding:** Check `docker compose logs app`. Is it listening? Are there error messages? Is it overwhelmed (less likely locally)?
-   **Database Connectivity Issues:** 
    1.  Check `app` logs for connection error details.
    2.  Check `db` logs to see if it's running and accepting connections.
    3.  Verify environment variables in `/server/.env` related to `DATABASE_URL` are correct for the Docker setup (host `db`, correct user/pass/db_name).
-   **Specific API Endpoint Failing:** Check `app` logs around the time of the request. Look for errors related to that endpoint's logic.

Refer to the `docs/runbook.md` for more detailed troubleshooting steps for common issues.

---

## 5. Host System Resource Monitoring

If the application or Docker services seem sluggish, or if Docker itself is having issues:

-   **Docker Desktop Dashboard:** If you are using Docker Desktop, it often provides a dashboard showing CPU, memory, and disk usage for containers and the Docker Engine.
-   **System Monitoring Tools:** Use your operating system's native tools:
    -   **Linux:** `top`, `htop`, `docker stats` (shows live resource usage for containers).
    -   **macOS:** Activity Monitor, `docker stats`.
    -   **Windows:** Task Manager (Details and Performance tabs), `docker stats`.

High CPU or memory usage by a container might indicate an inefficient process or a bug (e.g., an infinite loop).

This basic log monitoring should be sufficient for most local development scenarios. For more advanced needs in staging or production, dedicated logging platforms (ELK stack, Grafana Loki, Splunk, Datadog) and metrics monitoring systems (Prometheus, Grafana) would be employed.
