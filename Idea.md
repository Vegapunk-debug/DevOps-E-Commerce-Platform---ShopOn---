# Project Name: ShopOn 
### High-Performance Sneaker E-Commerce Platform

## 1. Project Overview
ShopOn is a niche e-commerce application designed for "Flash Sales" of limited-edition sneakers. Unlike standard retail stores, ShopOn focuses on high-demand product launches ("Drops").

The core objective of this project is to simulate a production-ready environment capable of handling deployment automation and container orchestration, ensuring the site remains stable even during inventory updates.

## 2. Technology Stack
The application is built using a type-safe implementation of the MERN stack:

* **Frontend:** React (Vite) + TypeScript/JavaScript + Tailwind CSS
* **Backend:** Node.js + Express + TypeScript/JavaScript
* **Database:** MySql/ MongoDB

## 3. DevOps Architecture (The "Develops" Component)
This project serves as a practical implementation of the DevOps lifecycle:

### A. Containerization
* **Docker:** Custom multi-stage builds for both Client and Server to optimize image size.
* **Docker Compose:** Orchestration of the Frontend, Backend, and Database services for a unified local development environment.

### B. CI/CD Pipelines (GitHub Actions)
* **Continuous Integration:**
    * **Linting:** Automated ESLint checks to enforce code quality.
    * **Testing:** Automated execution of Jest unit tests on every Pull Request.
* **Continuous Deployment:**
    * **Build:** Automatic creation of Docker images tagged with the commit SHA.
    * **Registry:** Pushing images to Docker Hub or GitHub Container Registry (GHCR).

### C. Operational Reliability
* **Health Checks:** Implementation of `/health` endpoints to monitor API uptime.
* **Environment Management:** Secure handling of secrets (DB URIs, JWT Keys) using `.env` injection during deployment.

## 4. Key Functional Features (MVP)
* **The "Drop" Page:** A landing page featuring the latest sneaker releases.
* **User Accounts:** Secure authentication (JWT) to save shipping details for faster checkout.
* **Inventory Management:** Real-time stock decrementing to prevent overselling.
* **Order Simulation:** A checkout process that validates stock, "processes" payment, and generates an order receipt.

## 5. Development Timeline
* **Phase 1: Setup:** Initialize Repo, TS Config, and Docker Compose environment.
* **Phase 2: Core API:** Build User Auth and Product (Sneaker) CRUD endpoints.
* **Phase 3: Frontend:** Develop the React UI for the Shop and Cart.
* **Phase 4: Pipelines:** Implement GitHub Actions for CI (Testing) and CD (
