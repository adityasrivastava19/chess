# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/wsbackend
COPY wsbackend/package*.json ./
RUN npm install
COPY wsbackend/ ./
RUN npx tsc -b

# Stage 3: Unified Production Runner
FROM node:20-alpine AS runner

# Install Nginx and required dependencies
RUN apk add --no-cache nginx

# Copy Nginx configuration and compiled static frontend files
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Prepare workspace directory for backend
WORKDIR /app/wsbackend
COPY wsbackend/package*.json ./
RUN npm install --only=production
COPY --from=backend-builder /app/wsbackend/dist ./dist

# Add entrypoint script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 80 8080

CMD ["/bin/sh", "/app/start.sh"]
