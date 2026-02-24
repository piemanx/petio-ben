# Project Context: Petio (Ben's Fork)

## Overview
A request, review, and discovery companion app for Plex. Allows users to interact with media on and off the server. This appears to be a fork or clone of the original Petio project.

## Tech Stack
- **Backend:** Node.js (Express), Mongoose (MongoDB).
- **Frontend:** React 17, Redux, Vite 7, SCSS.
- **Admin:** React 17, Redux, Vite 7, SCSS.
- **Orchestration:** Node.js (`petio.js` entry point).

## Architecture
The project is divided into three main components:
-   **`api/`**: The backend REST API.
-   **`frontend/`**: The user-facing web application.
-   **`admin/`**: The administration dashboard.
-   **`petio.js`**: The main entry point that likely orchestrates or proxies these services.

## Key Commands
-   **Start All (Orchestrator):** `npm start` (in root) - runs `node petio.js`.
-   **Start API (Dev):** `cd api && npm start`
-   **Start Frontend (Dev):** `cd frontend && npm start` (Vite)
-   **Start Admin (Dev):** `cd admin && npm start` (Vite)
-   **Docker:** `docker-compose up -d`

## Configuration
-   **Database:** Requires a MongoDB instance.
-   **Environment:** Configuration seems to be handled via the admin UI or config files (needs further investigation).

## Status
-   **Version:** 0.5.7-alpha
-   **Note:** The project mixes older Node.js targets (Node 14) with very recent build tools (Vite 7).
