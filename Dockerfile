# syntax=docker/dockerfile:1

# ---- 1. Install dependencies (kept as its own layer so it caches) ----
FROM node:22-bookworm-slim AS deps
WORKDIR /app
# better-sqlite3 ships prebuilt binaries, but keep a toolchain available as a
# fallback in case any dependency needs to compile during `npm ci`.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# ---- 2. Build the production bundle ----
FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- 3. Production runtime image (serves with `next start`) ----
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATABASE_PATH=/app/data/builderverse.db

# Production-only dependencies. better-sqlite3 ships linux prebuilds that
# resolve from node_modules at runtime — nothing to trace or copy by hand.
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev \
  && npm cache clean --force \
  && chown -R node:node /app/node_modules

COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public

RUN mkdir -p /app/data && chown node:node /app/data

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node_modules/.bin/next", "start"]
