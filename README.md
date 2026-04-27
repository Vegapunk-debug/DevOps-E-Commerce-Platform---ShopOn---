# ShopOn: Professional E-Commerce Foundations

This project serves as a robust foundation for an e-commerce platform, demonstrating best practices in full-stack development, automated testing, and CI/CD orchestration.

## Project Architecture

### Frontend
- **Framework:** React (Powered by Vite)
- **Styling:** Vanilla CSS for maximum performance and design flexibility.
- **State Management:** Functional components utilizing React Hooks.

### Backend
- **Runtime:** Node.js with Express.js for API routing.
- **ORM:** Prisma for type-safe database interactions and migrations.
- **Database:** SQLite3 for development simplicity.

### Infrastructure & DevOps
- **Containerization:** Docker for environment parity.
- **CI/CD:** GitHub Actions for automated linting and testing.
- **Dependency Management:** Dependabot for security tracking.

## Automated Workflow
- **Local Development:** Use the idempotent `run.sh` script to build and launch the environment.
- **CI Validation:** Every push and `pull_request` triggers the GitHub Actions Pipeline.
  - Installs dependencies.
  - Generates Prisma Client.
  - Strict Linting (ESLint/Prettier).
  - Execution of Jest and Cypress testing suites.

## Design Decisions & Challenges
- **Prisma & SQLite:** Chosen for rapid iteration while maintaining strong data integrity.
- **Vanilla CSS:** Prioritized to demonstrate deep knowledge of CSS layout principles.
- **Strict CI:** Initial pipeline was informational but transitioned to Strict Mode to ensure zero regression in code quality.

## Getting Started

### One-Command Setup (Recommended)
Run the idempotent setup script to build the Docker images and launch the complete environment:
```bash
bash run.sh
```

### Manual Setup (Developer Mode)
If you prefer to run the components separately without Docker:

**1. Database & Backend Configuration**
Navigate to the server directory, install dependencies, and initialize the database:
```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
```
*Note: This will create a local dev.db file using SQLite.*

**2. Start Backend Server**
Launch the server in development mode (with hot-reload):
```bash
npm run dev
```

**3. Frontend Setup**
In a new terminal, navigate to the client directory and start the development server:
```bash
cd client
npm install
npm run dev
```

## Testing Suite

### Unit & Integration Tests
Run server-side tests:
```bash
cd server && npm test
```

### End-to-End Tests
Launch Cypress to verify user flows:
```bash
cd client && npm run test:e2e
```