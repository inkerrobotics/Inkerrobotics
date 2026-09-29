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

# Both services run in the same container — backend is on localhost:4000
ARG NEXT_PUBLIC_API_URL=https://inkerrobotics.onrender.com
ARG NEXT_PUBLIC_SITE_URL=https://inkerrobotics.com
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdhWBctAAAAAOffK5BWiQPitSYCaI9_VK5d4tZO
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY

RUN npm run build


# ── Stage 3: Final lean image ─────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production \
    PORT=3000 \
    ADMIN_SECRET=inker-admin-2026 \
    FRONTEND_URL=https://inkerrobotics.onrender.com \
    NOTIFY_EMAIL=info@inkerrobotics.com \
    DATABASE_URL=postgresql://postgres.uccstywbazpvlljeibey:InkerWebsite987@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true \
    DIRECT_URL=postgresql://postgres.uccstywbazpvlljeibey:InkerWebsite987@aws-1-ap-south-1.pooler.supabase.com:5432/postgres \
    SUPABASE_URL=https://uccstywbazpvlljeibey.supabase.co \
    SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjY3N0eXdiYXpwdmxsamVpYmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3Nzc2ODMsImV4cCI6MjA5NTM1MzY4M30.NWIMqea_8nszz2NE6DwfoOjzK356UDJDHQBicgzsPSA \
    RESEND_API_KEY=re_amwBMiaP_9Z66X96dxUg1b3hgkFNVsXjw \
    RECAPTCHA_SECRET_KEY=6LdhWBctAAAAACvd6DDaxEFLXdmuxu4zcGJR43-h

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
