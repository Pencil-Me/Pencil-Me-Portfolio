# Use the official PHP 8.1 image as the base
FROM php:8.1-apache

# Set the ServerName directive to suppress AH00558 message
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Install PDO extension
RUN docker-php-ext-install pdo pdo_mysql

# Enable the PDO extension explicitly
RUN docker-php-ext-enable pdo

# Install cURL
# RUN apt-get update && apt-get install -y \
#    libcurl4-openssl-dev \
#    && docker-php-ext-install -j$(nproc) curl

# Set the working directory within the container
WORKDIR /var/www/html

# Copy the source code into the container's working directory
COPY src/ .

# Expose port 80
EXPOSE 80

# Enable hot reload by mounting a volume for the src directory
# This will allow changes made to the source code on the host machine to be reflected immediately in the container
VOLUME /var/www/html
