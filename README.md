E-Commerce Store Base (Node.js + React)

Fullstack e-commerce application template built with Node.js (NestJS)
and React. The project demonstrates modular backend architecture,
role-based authentication, REST API design, and Docker-based deployment
setup.

This repository serves as a foundation for building scalable e-commerce
solutions.

------------------------------------------------------------------------

TECH STACK

Backend: - Node.js - NestJS - PostgreSQL - JWT Authentication -
Role-based Authorization (Admin / Customer) - REST API

Frontend: - React - Axios - Role-based UI logic

Infrastructure: - Docker - Docker Compose - Nginx (reverse proxy) -
Environment-based configuration

------------------------------------------------------------------------

FEATURES

-   User registration & authentication (JWT)
-   Role-based access control
-   Products CRUD
-   Categories CRUD
-   User management
-   RESTful API architecture
-   Modular backend structure
-   Dockerized local development environment

------------------------------------------------------------------------

ARCHITECTURE OVERVIEW

Backend follows a modular architecture pattern:

-   Controllers → handle HTTP requests
-   Services → business logic
-   DTOs → request validation
-   Guards → authentication & authorization
-   Database layer → PostgreSQL

The frontend communicates with the backend via REST API.

------------------------------------------------------------------------

AUTHENTICATION & AUTHORIZATION

-   JWT-based authentication
-   Role-based access control:
    -   Admin: manage products, categories, users
    -   Customer: browse products, manage profile

------------------------------------------------------------------------

RUNNING THE PROJECT (DOCKER)

docker-compose up –build

Application will be available at: - Frontend: http://localhost:3000 -
Backend API: http://localhost:5000

------------------------------------------------------------------------

RUNNING LOCALLY (WITHOUT DOCKER)

Backend: cd backend npm install npm run start:dev

Frontend: cd frontend npm install npm start

------------------------------------------------------------------------

API EXAMPLE ENDPOINTS

POST /auth/login POST /auth/register GET /products POST /products PUT
/products/:id DELETE /products/:id

------------------------------------------------------------------------

PROJECT PURPOSE

This project is not intended as a finished production store, but as a
scalable starter template demonstrating:

-   Backend architecture patterns
-   Authentication & role management
-   REST API design
-   Fullstack integration
-   Containerized development workflow

------------------------------------------------------------------------

FUTURE IMPROVEMENTS

-   Unit & integration tests
-   Swagger / OpenAPI documentation
-   Payment integration
-   Order management
-   CI/CD pipelines

------------------------------------------------------------------------
