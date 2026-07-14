# ============================================
# Dockerfile untuk Next.js 16 (Standalone Mode)
# Multi-stage build untuk image kecil
# ============================================

# ── Stage 1: Dependencies ──
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies system yang diperlukan
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --prefer-offline --no-audit

# ── Stage 2: Builder ──
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry saat build
ENV NEXT_TELEMETRY_DISABLED=1

# Build
RUN npm run build

# ── Stage 3: Runner (Production) ──
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Buat user non-root untuk security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/public ./public

# Copy standalone build & static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]