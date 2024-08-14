# Konecta Backend

This is the backend part of the Konecta project, built with Node.js and Express. The backend handles the API and database interactions. It can be run locally or containerized using Docker for easy deployment and management.

## Table of Contents

- [Konecta Backend](#konecta-backend)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
    - [1. Run the Project Locally](#1-run-the-project-locally)
    - [2. Create a Docker Network](#2-create-a-docker-network)
    - [3. Configure Environment Variables for Docker](#3-configure-environment-variables-for-docker)
  - [Running the Project Locally](#running-the-project-locally)
  - [Running the Project with Docker](#running-the-project-with-docker)
    - [Accessing the API](#accessing-the-api)
  - [Stopping the Project](#stopping-the-project)
  - [Docker Compose Commands](#docker-compose-commands)
  - [Prisma and Database Migrations](#prisma-and-database-migrations)
    - [Running Migrations Locally](#running-migrations-locally)
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

- Node.js (for running the project locally): [Install Node.js](https://nodejs.org/)
- PostgreSQL (for running the project locally): [Install PostgreSQL](https://www.postgresql.org/download/)
- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Setup Instructions

### 1. Run the Project Locally

If you prefer to run the project locally without Docker, follow these steps:

1. **Install PostgreSQL and Create a Database:**
   
   Ensure PostgreSQL is installed on your local machine. Create a database named `konecta_db` or as specified in your `.env` file.

2. **Configure Environment Variables:**

   Create a `.env` file in the root directory of the project with the following content:

   ```env
   PORT=8080
   SECRETORPRIVATEKEY=Est03sMyPub1cK3yKonecta
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/konecta_db
   ```

   - **PORT**: The port on which the backend service will run.
   - **SECRETORPRIVATEKEY**: The secret key used for JWT authentication.
   - **DATABASE_URL**: The connection string for the PostgreSQL database.

3. **Install Dependencies:**

   Run the following command to install the project dependencies:

   ```bash
   npm install
   ```

4. **Generate Prisma Client:**

   Run the following command to generate the Prisma client:

   ```bash
   npx prisma generate
   ```

5. **Run Migrations:**

   Apply the migrations to your local database with:

   ```bash
   npx prisma migrate dev --name init
   ```

6. **Start the Backend:**

   Start the backend service with:

   ```bash
   npm start
   ```

   The backend should now be running locally at [http://localhost:8080](http://localhost:8080).

### 2. Create a Docker Network

If running with Docker, ensure that the Docker network `konecta_network` is created:

```bash
docker network create konecta_network
```

### 3. Configure Environment Variables for Docker

Ensure the `.env` file in the `konecta-backend` directory is correctly configured with the following variables for Docker:

```env
PORT=8080
SECRETORPRIVATEKEY=Est03sMyPub1cK3yKonecta
DATABASE_URL=postgresql://example_user:example_password@db:5432/konecta_db
```

## Running the Project Locally

If running locally, the backend will be available at [http://localhost:8080](http://localhost:8080) after executing `npm start`.

## Running the Project with Docker

To start the backend service using Docker Compose:

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

### Running Migrations Locally

To run migrations locally, use the following command:

```bash
npx prisma migrate dev --name init
```

### Generating Prisma Client

If you make changes to your Prisma schema, you can regenerate the client by running:

```bash
npx prisma generate
```

## Additional Notes

- Ensure that the `konecta_network` Docker network is shared with the database and other necessary services.
- If you make changes to the application code or dependencies, rebuild the Docker image using `docker-compose build` and restart the service.