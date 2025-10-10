# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with Vite Preview
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for vite preview)
RUN npm ci

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 4173
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4173/ || exit 1

# Start Vite preview server
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "4173"]
