# ---- build ----
FROM node:22-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- runtime ----
FROM nginx:1.27-alpine AS runtime
# Como template: o entrypoint da imagem roda envsubst e substitui ${API_PORT}
# antes de subir o Nginx (com API_PORT default 3001, definido no compose).
ENV API_PORT=3001
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
