# Technical Documentation

## Architecture Overview

Petio is a request, review, and discovery companion app for Plex. The modernized architecture consists of:

*   **Backend:** Node.js (Express) with Mongoose (MongoDB).
    *   **Entry Point:** `api/app.js`
    *   **Testing:** Vitest + Supertest
*   **Frontend:** React 18 (Functional Components, Hooks) built with Vite.
    *   **Location:** `frontend/`
    *   **State Management:** Redux (migrating to Toolkit patterns)
*   **Admin:** React 18 Admin Dashboard built with Vite.
    *   **Location:** `admin/`
*   **Orchestration:** `petio.js` serves as the main entry point, proxying API requests and serving static frontend assets in production.

## Docker Strategy

The project uses a **multi-stage Docker build** to optimize image size and build reliability.

1.  **Backend Builder:** Installs production dependencies for the API.
2.  **Runner:** A lightweight `node:20-slim` image that:
    *   Copies backend dependencies.
    *   Copies pre-built frontend artifacts (`frontend/build` and `admin/build`).
    *   Runs the application using `node petio.js`.

**Note:** Currently, frontend assets must be built locally (`npm run build` in `frontend/` and `admin/`) before building the Docker image due to execution permission restrictions in some Docker build environments.

## Refactoring Guide

### Class to Functional Components
We are actively migrating legacy Class Components to Functional Components with Hooks.

**Pattern:**
```javascript
// Before
class MyComponent extends React.Component {
  componentDidMount() { ... }
  render() { return <div>...</div> }
}
export default connect(mapStateToProps)(MyComponent);

// After
const MyComponent = (props) => {
  const data = useSelector(state => state.data);
  useEffect(() => { ... }, []);
  return <div>...</div>
}
export default MyComponent;
```

### Testing
*   **Backend:** Run `npm test` in `api/` directory.
*   **Frontend:** Run `npm run lint` to check for code quality issues.

## Key Directories
*   `api/`: Backend source code.
*   `frontend/`: Main user interface.
*   `admin/`: Administration interface.
*   `config/`: Configuration files (created at runtime).
