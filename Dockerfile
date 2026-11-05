# =========================================================================
# نظام موارد بشرية شركة جوهرة المجد - Jawharat Al-Majd HRMS
# Universal Production Dockerfile for Any OS (Linux/Unix/Windows/macOS/Cloud)
# Requires Node.js >= 22 (for built-in node:sqlite DatabaseSync support)
# =========================================================================

FROM node:22-alpine AS runner

# Label metadata
LABEL maintainer="Jawharat Al-Majd Engineering <admin@jalmajd.com>"
LABEL description="Jawharat Al-Majd HRMS Enterprise System"
LABEL version="2.4"

# Set timezone to Saudi Arabia
ENV TZ=Asia/Riyadh
RUN apk add --no-cache tzdata curl bash \
    && cp /usr/share/zoneinfo/Asia/Riyadh /etc/localtime \
    && echo "Asia/Riyadh" > /etc/timezone

# Create application workspace
WORKDIR /app

# Ensure proper non-root node user or permissions
ENV NODE_ENV=production
ENV PORT=3000
ENV DATA_DIR=/app/server/database

# Copy package files first for optimized Docker cache layer
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --no-audit --prefer-offline || npm install --omit=dev --no-audit

# Copy application source code
COPY . .

# Ensure storage, upload, and database directories exist with read/write permissions
RUN mkdir -p /app/server/database /app/uploads /app/public/assets \
    && chmod -R 777 /app/server/database /app/uploads

# Expose standard HRMS port
EXPOSE 3000

# Health check to ensure zero-downtime and automatic recovery
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/api/settings || exit 1

# Production startup command
CMD ["node", "server/server.js"]
