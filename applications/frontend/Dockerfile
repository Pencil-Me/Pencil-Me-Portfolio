# Stage 1: Build frontend
FROM node:20-alpine as angular

# make the 'app' folder the current working directory
WORKDIR /fe-angular-app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json .
# install project dependencies
RUN npm ci

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .
# build app for production with minification
RUN npm run build

# Stage 2: Serve it using Ngnix
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=angular /fe-angular-app/dist/portfolio/browser /usr/share/nginx/html

EXPOSE 80
