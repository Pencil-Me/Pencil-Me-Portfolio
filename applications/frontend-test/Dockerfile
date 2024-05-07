# Stage 1: Build frontend
FROM node:20-alpine as angular

WORKDIR /ng-app
COPY . ./dist/portfolio/browser

# Stage 2: Serve it using Ngnix
FROM nginx:alpine

COPY --from=angular /ng-app/dist/portfolio/browser /usr/share/nginx/html

EXPOSE 80
