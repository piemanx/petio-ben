# Stage 1: Install Backend Dependencies
FROM node:20-slim AS backend-builder
WORKDIR /app

# Install build dependencies (python/make/g++) just in case, though likely not needed for prod deps
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Install Root Dependencies (Production Only)
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Install API Dependencies (Production Only)
COPY api/package*.json ./api/
WORKDIR /app/api
RUN npm ci --legacy-peer-deps --omit=dev --ignore-scripts

# Stage 2: Runner
FROM node:20-slim AS runner

RUN apt-get update && apt-get install -y tini tzdata && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN chown node:node /app

USER node

# Copy Backend Dependencies from Builder
COPY --from=backend-builder --chown=node:node /app/node_modules ./node_modules
COPY --from=backend-builder --chown=node:node /app/api/node_modules ./api/node_modules

# Copy Application Source
COPY --chown=node:node ./package.json ./petio.js ./router.js ./
COPY --chown=node:node ./api ./api

# Copy Pre-built Frontend & Admin (From Host Context)
COPY --chown=node:node ./frontend/build ./views/frontend
COPY --chown=node:node ./admin/build ./views/admin

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
