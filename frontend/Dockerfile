# Multi-stage build for optimized frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_NAKAMA_HOST
ARG VITE_NAKAMA_PORT
ARG VITE_NAKAMA_USE_SSL
ARG VITE_NAKAMA_SERVER_KEY

# Create .env file from build args
RUN echo "VITE_NAKAMA_HOST=${VITE_NAKAMA_HOST}" > .env && \
    echo "VITE_NAKAMA_PORT=${VITE_NAKAMA_PORT}" >> .env && \
    echo "VITE_NAKAMA_USE_SSL=${VITE_NAKAMA_USE_SSL}" >> .env && \
    echo "VITE_NAKAMA_SERVER_KEY=${VITE_NAKAMA_SERVER_KEY}" >> .env

# Build the application
RUN npm run build

# Production stage - Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Create health check endpoint
RUN echo '<!DOCTYPE html><html><body>OK</body></html>' > /usr/share/nginx/html/health

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
