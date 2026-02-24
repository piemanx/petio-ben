# Todo

## High Priority
- [ ] **Refactor Page Components:** Migrate complex pages like `Movie.jsx`, `Show.jsx`, and `Request.jsx` to Functional Components.
- [ ] **Redux Toolkit:** Migrate legacy Redux (actions/reducers) to Redux Toolkit Slices.
- [ ] **Type Safety:** Introduce TypeScript to `api/` and `frontend/` incrementally.
- [ ] **Testing:** Increase test coverage for the API (currently only smoke tests).

## DevOps
- [ ] **CI/CD:** Expand GitHub Actions to include frontend testing (Vitest for React).
- [ ] **Docker:** Investigate and fix `EACCES` issues to enable full in-Docker frontend builds.

## Features
- [ ] **Config Management:** Move away from local JSON files to environment variables or a database-backed configuration for stateless container deployment.
