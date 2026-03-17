# ── Stage 1: build ──────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:all

# ── Stage 2: serve with Nginx ────────────────────────────────────
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/dist-widget /usr/share/nginx/html/widget
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
