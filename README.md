# Konecta Backend

This is the backend part of the Konecta project, built with Node.js and Express. The backend handles the API and database interactions, and it is containerized using Docker for easy deployment and management.

## Table of Contents

- [Konecta Backend](#konecta-backend)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
    - [1. Create a Docker Network](#1-create-a-docker-network)
    - [2. Configure Environment Variables](#2-configure-environment-variables)
  - [Running the Project](#running-the-project)
    - [Accessing the API](#accessing-the-api)
  - [Stopping the Project](#stopping-the-project)
  - [Docker Compose Commands](#docker-compose-commands)
  - [Prisma and Database Migrations](#prisma-and-database-migrations)
    - [Running Migrations](#running-migrations)
    - [Generating Prisma Client](#generating-prisma-client)
  - [Additional Notes](#additional-notes)

## Project Structure

Here is a brief overview of the key files in this project:

- **Dockerfile**: Contains the instructions for building the Docker image for the backend.
- **docker-compose.yml**: Docker Compose configuration for running the backend service.
- **.env**: Environment variables file used to configure the backend service.
- **package.json**: Lists the project's dependencies and scripts.
- **prisma/**: Contains the Prisma schema for database interactions.

## Prerequisites

Before you start, make sure you have the following installed on your machine:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Setup Instructions

### 1. Create a Docker Network

Ensure that the Docker network `konecta_network` is created, as it is required for the backend to connect to the database:

```bash
docker network create konecta_network
```

### 2. Configure Environment Variables

Ensure the `.env` file in the `konecta-backend` directory is correctly configured with the following variables:

```env
PORT=8080
SECRETORPRIVATEKEY=Est03sMyPub1cK3yKonecta
DATABASE_URL=postgresql://example_user:example_password@db:5432/konecta_db
```

- **PORT**: The port on which the backend service will run.
- **SECRETORPRIVATEKEY**: The secret key used for JWT authentication.
- **DATABASE_URL**: The connection string for the PostgreSQL database.

## Running the Project

To start the backend service, use Docker Compose:

```bash
docker-compose -f docker-compose.yml up -d
```

This command will start the backend service in detached mode (`-d`), meaning it will run in the background.

### Accessing the API

Once the backend service is running, you can access the API at:

```
http://localhost:8080
```

## Stopping the Project

To stop the backend service, run:

```bash
docker-compose -f docker-compose.yml down
```

This will stop and remove the container.

## Docker Compose Commands

Here are some useful Docker Compose commands:

- **Build the Docker image**: `docker-compose -f docker-compose.yml build`
- **Start the service**: `docker-compose -f docker-compose.yml up -d`
- **Stop the service**: `docker-compose -f docker-compose.yml down`
- **View logs**: `docker-compose -f docker-compose.yml logs -f backend`

## Prisma and Database Migrations

This project uses [Prisma](https://www.prisma.io/) as the ORM to interact with the PostgreSQL database. 

### Running Migrations

The migrations are automatically applied when the backend service starts, thanks to the following command in `docker-compose.yml`:

```yaml
command: sh -c "npx prisma migrate deploy && npm start"
```

This command ensures that any pending migrations are applied before the backend service starts.

### Generating Prisma Client

Prisma client is generated during the Docker build process using the following command in the Dockerfile:

```bash
RUN npx prisma generate
```

If you make changes to your Prisma schema, you can regenerate the client by running:

```bash
npx prisma generate
```

## Additional Notes

- Ensure that the `konecta_network` Docker network is shared with the database and other necessary services.
- If you make changes to the application code or dependencies, rebuild the Docker image using `docker-compose build` and restart the service.
