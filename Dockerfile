FROM node:20-slim

RUN apt-get update && apt-get install -y tini tzdata && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN chown node:node /app

# Switch to node user
USER node

# Copy API and Root files
COPY --chown=node:node ./package.json ./petio.js ./router.js ./
COPY --chown=node:node ./api ./api

# Install Root and API dependencies
RUN npm install --ignore-scripts
WORKDIR /app/api
RUN npm install --legacy-peer-deps --ignore-scripts

# Return to root
WORKDIR /app

# Copy Pre-built Frontend and Admin from Host
# Ensure you run 'npm run build' in ./frontend and ./admin locally first!
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
