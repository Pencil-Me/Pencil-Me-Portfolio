# build stage
FROM node:lts-alpine AS build-stage
WORKDIR /app

ARG VITE_API_URL=http://localhost:8080/api
ARG VITE_API_KEY=placeholder
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_KEY=$VITE_API_KEY

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
