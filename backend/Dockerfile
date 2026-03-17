# ── Stage 1: build ──────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

# ── Stage 2: runtime ────────────────────────────────────────────
FROM node:22-alpine
WORKDIR /app

# Copy only production dependencies and source
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Create a non-root user
RUN addgroup -S crm && adduser -S crm -G crm
USER crm

EXPOSE 3001
CMD ["node", "server.js"]
