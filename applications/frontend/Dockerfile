# Stage 1: Build frontend
FROM node:20-alpine as angular

ARG BUILD_CONFIGURATION=docker
ARG API_KEY_FE=secretApiFEkey

# make the 'app' folder the current working directory
WORKDIR /fe-angular-app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json .
# install project dependencies
RUN npm ci

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .
# API_KEY_FE aus Compose (.env) — muss mit php-rest-api/src/Inc/.env.dev uebereinstimmen
RUN sed -i "s|API_KEY: 'secretApiFEkey'|API_KEY: '${API_KEY_FE}'|g" src/environments/environment.docker.ts
# docker = lokaler Compose-Stack (/api2), production = externe Prod-API
RUN npm run build -- --configuration ${BUILD_CONFIGURATION}

# Stage 2: Serve it using Ngnix
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=angular /fe-angular-app/dist/portfolio/browser /usr/share/nginx/html

EXPOSE 80
