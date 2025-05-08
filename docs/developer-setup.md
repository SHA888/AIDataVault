# AIDataVault Developer Setup (Local Docker Environment)

This guide outlines the steps for new developers to set up and run the AIDataVault application locally using Docker and Docker Compose. This is the recommended setup for backend development.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1.  **Git:** For cloning the repository.
2.  **Docker Engine:** The core Docker runtime.
3.  **Docker Compose:** For defining and running multi-container Docker applications.

    *Installation guides for Docker can be found on the [official Docker website](https://docs.docker.com/get-docker/). Docker Desktop typically includes Docker Compose.* 

## Setup Instructions

### 1. Clone the Repository

Open your terminal and clone the AIDataVault project:

```bash
git clone https://github.com/yourusername/ai-datavault.git # Replace with the actual repository URL
cd ai-datavault
```

### 2. Configure Server Environment Variables

The backend server requires an environment file to configure its connection to the database and other settings. This is managed by the `/server/.env` file.

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```

2.  Copy the example environment file to create your local configuration:
    ```bash
    cp .env.example .env
    ```

3.  Open `/server/.env` in a text editor. For the Docker setup, ensure the following variables are correctly set:

    ```env
    # These are used by docker-compose.yml to initialize the PostgreSQL container
    # and also referenced in DATABASE_URL
    DB_NAME=aidatavault_db
    DB_USER=aidatavault_user
    DB_PASSWORD=aidatavault_password 

    # This is critical for the Node.js application running inside Docker
    # It tells the app how to connect to the PostgreSQL service (named 'db')
    DATABASE_URL="postgresql://aidatavault_user:aidatavault_password@db:5432/aidatavault_db"

    # Application Port (internal to the container, mapped in docker-compose.yml)
    PORT=3001

    # JWT Secret for token generation
    JWT_SECRET="your_strong_random_jwt_secret_here" # Generate a strong secret
    JWT_EXPIRES_IN='1h'

    # Other variables like CHEQD_API_KEY if needed by the application logic
    # CHEQD_API_KEY=your_cheqd_api_key_if_applicable
    ```

    **Important Notes:**
    *   The `DB_HOST` variable in `/server/.env` (if present for non-Docker fallbacks) would typically be `db` for Docker, but `DATABASE_URL` takes precedence in our current `server/src/config/database.js`.
    *   The `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` variables in `docker-compose.yml` are used to *initialize* the PostgreSQL container. The application running in the `app` container then uses the `DATABASE_URL` (from `/server/.env`) to *connect* to this initialized database.

### 3. Start the Application with Docker Compose

Navigate back to the root directory of the project (the one containing `docker-compose.yml`):

```bash
cd .. # If you are still in the server/ directory
```

Run the following command to build the images (if they don't exist or have changed) and start the application and database services:

```bash
docker compose up --build
```

This command will display logs from all services in your terminal. The `-d` flag can be added to run in detached mode (background):

```bash
docker compose up --build -d
```

### 4. Accessing the Application

Once the services are running successfully (you should see logs indicating the database is ready and the server is listening on port 3001), you can access the application:

*   **API Endpoints:** Via `http://localhost:3001` (or the port you mapped in `docker-compose.yml`). For example, `http://localhost:3001/api/some-endpoint`.
*   If there's a root endpoint that sends a welcome message, you might see it by navigating to `http://localhost:3001` in your browser.

## Common Docker Commands

Refer to the `docs/runbook.md` for a comprehensive list of Docker commands, including:

*   Stopping the application: `docker compose down`
*   Viewing logs: `docker compose logs app` or `docker compose logs db`
*   Rebuilding images: `docker compose build app`
*   Accessing the database directly: `docker exec -it aidatavault-db-1 psql -U aidatavault_user -d aidatavault_db`

## (Optional) Running Backend Without Docker

If you need to run the backend server directly on your host machine (without Docker), refer to the general "Getting Started" section in the main `README.md` of the project. This typically involves:

1.  Ensuring Node.js and npm/yarn are installed.
2.  Installing project dependencies: `cd server && npm install`.
3.  Configuring `/server/.env` with appropriate values for a non-Docker setup (e.g., `DB_HOST=localhost` if PostgreSQL is running directly on your host).
4.  Starting the server: `cd server && npm start` or `npm run dev` (if a dev script is configured).

Note: This method requires you to manage the PostgreSQL database instance separately.
