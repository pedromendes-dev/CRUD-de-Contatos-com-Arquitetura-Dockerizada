# ─── STAGE 1: BUILD ──────────────────────────────────────────────────────────
# Usa Node para instalar dependencias e compilar o projeto React/Vite.
FROM node:20-alpine AS build
WORKDIR /app

# VITE_API_URL define o prefixo das chamadas de API geradas no bundle.
# Passado via docker-compose (args: VITE_API_URL: /api).
# O Vite incorpora esse valor em tempo de build — nao pode ser alterado em runtime.
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

# Copia manifesto de dependencias primeiro para aproveitar cache do Docker.
COPY package*.json ./
RUN npm ci

# CACHEBUST forca o Docker a nao usar cache a partir daqui quando necessario.
# Util quando arquivos mudaram mas o package.json nao.
ARG CACHEBUST=1
COPY . .
RUN npm run build

# ─── STAGE 2: SERVE ──────────────────────────────────────────────────────────
# Copia apenas o build estatico (/app/dist) para o nginx.
# A imagem final nao tem Node — e muito menor.
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Config do nginx interno do container frontend (SPA routing + proxy /api).
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
