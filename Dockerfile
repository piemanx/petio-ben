# Stage 1: Build Frontend
FROM node:20-slim AS builder-frontend
WORKDIR /app

# Install build dependencies for Admin
COPY admin/package*.json ./admin/
WORKDIR /app/admin
RUN npm ci --legacy-peer-deps

# Copy Admin Source and Build
COPY admin/ ./
RUN npm run build

# Install build dependencies for Frontend
WORKDIR /app
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci --legacy-peer-deps

# Copy Frontend Source and Build
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend & Root
FROM node:20-slim AS builder-backend
WORKDIR /app

# Root Dependencies
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# API Dependencies
COPY api/package*.json ./api/
WORKDIR /app/api
RUN npm ci --legacy-peer-deps --omit=dev --ignore-scripts

# Stage 3: Runner
FROM node:20-slim AS runner

RUN apt-get update && apt-get install -y tini tzdata && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN chown node:node /app

USER node

# Copy Root Dependencies and Scripts
COPY --from=builder-backend --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node ./package.json ./petio.js ./router.js ./

# Copy API Dependencies and Source
COPY --from=builder-backend --chown=node:node /app/api/node_modules ./api/node_modules
COPY --chown=node:node ./api ./api

# Copy Built Frontends
COPY --from=builder-frontend --chown=node:node /app/frontend/build ./views/frontend
COPY --from=builder-frontend --chown=node:node /app/admin/build ./views/admin

# Expose Port
EXPOSE 7777

# Data Volumes
VOLUME ["/app/api/config", "/app/logs"]

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD [ "node", "petio.js" ]

LABEL org.opencontainers.image.vendor="petio-team"
LABEL org.opencontainers.image.url="https://github.com/petio-team/petio"
LABEL org.opencontainers.image.documentation="https://docs.petio.tv/"
LABEL org.opencontainers.image.licenses="MIT"

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "node", "-e", "require('http').get('http://localhost:7777/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" ]
