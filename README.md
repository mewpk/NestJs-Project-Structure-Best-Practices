# NestJs Project Structure Best Practices

## Overview

This project uses Docker and Docker Compose to set up a full development environment, which includes:

- A **Node.js** backend service with **NestJS**
- Two **PostgreSQL** databases
- **Redis** caching server

The backend service is configured for both development and production environments with multistage Docker builds, using **pnpm** for package management and **Prisma** for ORM with support for two databases.

## Prerequisites

To run this project, make sure you have the following installed:

- **Docker**: [Download and Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: (Installed automatically with Docker Desktop)

## Docker Services

The `docker-compose.yml` defines the following services:

- **backend**: The Node.js/NestJS application.
- **db**: Primary PostgreSQL database.
- **db2**: Secondary PostgreSQL database.
- **redis**: Redis server for caching.

## Docker Images and Build Stages

- **base**: Installs `pnpm` and defines the work directory.
- **development**: Installs development dependencies, including `@nestjs/cli` and runs the application in watch mode.
- **build**: Builds the production-ready application and prunes unnecessary dependencies.
- **production**: Optimizes image size by copying only necessary files for production.

## Setup and Usage

### Build and Run

1. **Clone the repository**:

   ```bash
   git clone https://github.com/mewpk/NestJs-Project-Structure-Best-Practices.git
   cd NestJs-Project-Structure-Best-Practices
   ```

2. **Create a `.env` file**: At the root directory, create a `.env` file based on the `.env.example` file provided. Copy the contents of `.env.example` to `.env` and update the environment variables with your own configuration values.

3. **Build and run the services**:

   ```bash
   docker-compose up --build -d
   ```

4. **Access the services**:
   - **Backend**: `http://localhost:8080`
   - **Primary Database (db)**: `localhost:5432`
   - **Secondary Database (db2)**: `localhost:5433`
   - **Redis**: `localhost:6379`

### Health Checks

Health checks are implemented for each service:

- **Backend**: Checks `http://localhost:8080/health`
- **db** and **db2**: Uses `pg_isready` command
- **Redis**: Uses `redis-cli ping`
