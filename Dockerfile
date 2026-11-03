# ── Stage 1: Build backend ────────────────────────────────────────
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./
RUN npx prisma generate
RUN npm run build


# ── Stage 2: Build frontend ───────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

# Both services run in the same container — backend is on 127.0.0.1:4000
ARG NEXT_PUBLIC_API_URL=""
ARG NEXT_PUBLIC_SITE_URL=https://inkerrobotics.com
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdhWBctAAAAAOffK5BWiQPitSYCaI9_VK5d4tZO
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_OUTPUT=standalone

RUN npm run build


# ── Stage 3: Final lean image ─────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

# Only non-secret defaults live here. DATABASE_URL, DIRECT_URL,
# RESEND_API_KEY, ADMIN_SECRET, RECAPTCHA_SECRET_KEY, SUPABASE_URL and
# SUPABASE_ANON_KEY must be set in Render → Environment. Nothing falls
# back to a hard-coded value, so a missing setting shows up in the log
# instead of silently using an old one.
ENV NODE_ENV=production \
    PORT=3000 \
    FRONTEND_URL=https://inkerrobotics.onrender.com \
    NOTIFY_EMAIL=info@inkerrobotics.com

# Backend
COPY --from=backend-builder /app/backend/dist           ./backend/dist
COPY --from=backend-builder /app/backend/node_modules   ./backend/node_modules
COPY --from=backend-builder /app/backend/prisma         ./backend/prisma
COPY --from=backend-builder /app/backend/package.json   ./backend/package.json

# Frontend (Next.js standalone)
COPY --from=frontend-builder /app/frontend/.next/standalone  ./frontend/
COPY --from=frontend-builder /app/frontend/.next/static      ./frontend/.next/static
COPY --from=frontend-builder /app/frontend/public            ./frontend/public

# Node.js process manager — avoids all shell/CRLF issues
COPY launcher.js ./

EXPOSE 3000
CMD ["node", "launcher.js"]
