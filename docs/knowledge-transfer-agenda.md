# AIDataVault Knowledge Transfer Agenda (Backend & Local Docker Setup)

This document outlines a potential agenda for a knowledge transfer (KT) session aimed at new developers joining the AIDataVault project, specifically focusing on the backend and the local Docker-based development environment.

## Session Goal
To enable a new developer to understand the project's architecture, set up their local development environment, understand common operational procedures, and begin contributing to the backend codebase.

## Target Audience
New backend developers.

## Duration
Approximately 2-3 hours (can be split into multiple sessions).

## Prerequisites for Attendees
-   Basic understanding of Node.js, Express.js.
-   Familiarity with Git and version control concepts.
-   Basic familiarity with Docker concepts (though the setup guide will be covered).

## Agenda Items

**(Referenced documents are within the project's `/docs` folder or root `README.md`)**

1.  **Introduction & Project Overview (15-20 mins)**
    *   What is AIDataVault? (High-level goals and features)
    *   Core problem it solves.
    *   Brief mention of DID/VC integration concept.
    *   **Reference:** Main project `README.md` (Introduction section).

2.  **System Architecture (20-30 mins)**
    *   Walkthrough of the local development architecture diagram.
        *   Components: Node.js `app` service, PostgreSQL `db` service, Docker networking.
        *   Data flow for API requests.
    *   Overview of the CI/CD pipeline (GitHub Actions, SonarCloud).
    *   **Reference:** `README.md` (System Architecture section), `.github/workflows/node-ci.yml`.

3.  **Local Development Environment Setup (30-40 mins - Interactive)**
    *   Prerequisites (Git, Docker Engine, Docker Compose).
    *   Cloning the repository.
    *   Configuring `/server/.env` (emphasize `DATABASE_URL` for Docker).
    *   Starting the application with `docker compose up --build`.
    *   Verifying the setup (accessing an endpoint, checking logs).
    *   **Reference:** `docs/developer-setup.md`.

4.  **Running & Managing the Local Application (20-30 mins)**
    *   Starting and stopping services (`docker compose up -d`, `docker compose down`).
    *   Viewing logs effectively (`docker compose logs app`, `docker compose logs db`, `-f`, `--since`).
    *   Rebuilding services (`docker compose build app`).
    *   Accessing the PostgreSQL database directly (`docker exec ... psql`).
    *   **Reference:** `docs/runbook.md`, `docs/monitoring-local.md`.

5.  **Codebase Tour (Backend - 30-45 mins)**
    *   Directory structure of `/server/src`:
        *   `config/` (especially `database.js`)
        *   `controllers/` (if applicable, or logic within routes)
        *   `middleware/` (if applicable)
        *   `models/` (Sequelize models, `index.js`)
        *   `routes/` (`authRoutes.js`, `userRoutes.js` - how routes are defined)
        *   `utils/` (`passwordUtils.js`, `jwtUtils.js`)
        *   `index.js` / `app.js` (main server setup, middleware, route mounting).
    *   Environment variable handling (`dotenv`, `process.env`).
    *   How database connections are managed (Sequelize instance).

6.  **API Endpoints & Documentation (15-20 mins)**
    *   Overview of currently available API endpoints (Auth, Users).
    *   How to use the `docs/api-documentation.md`.
    *   Briefly touch on Swagger annotations in route files as the source of truth.
    *   **Reference:** `docs/api-documentation.md`, `server/src/routes/authRoutes.js`, `server/src/routes/userRoutes.js`.

7.  **Security Considerations (15-20 mins)**
    *   Key security measures: JWT authentication, password hashing.
    *   Secrets management (`.env` file, `.gitignore`).
    *   Importance of input validation.
    *   Dependency security (`npm audit`, SonarCloud).
    *   **Reference:** `docs/security.md`.

8.  **Troubleshooting & Data Recovery (10-15 mins)**
    *   Common issues (port conflicts, DB connection errors) and how to approach them using logs.
    *   Brief overview of database backup (`pg_dump`) and restore for local data persistence.
    *   **Reference:** `docs/runbook.md` (Troubleshooting section), `docs/disaster-recovery.md`.

9.  **Q&A and Next Steps (10-15 mins)**
    *   Open floor for questions.
    *   Assigning a first small task or issue to the new developer.

## Materials to Provide
-   Link to the project repository.
-   Ensure all documentation in the `/docs` folder and the main `README.md` is up-to-date.

This agenda provides a comprehensive starting point. It can be adjusted based on the new developer's experience level and specific project needs.
