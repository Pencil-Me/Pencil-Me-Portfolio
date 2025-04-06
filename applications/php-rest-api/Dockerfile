# Use the official PHP 8.1 image as the base
FROM php:8.1-apache

# Set the ServerName directive to suppress AH00558 message
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Set the DocumentRoot to the public directory
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    && rm -rf /var/lib/apt/lists/*

# Install PDO extension
RUN docker-php-ext-install pdo pdo_mysql

# Enable the PDO extension explicitly
RUN docker-php-ext-enable pdo

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set the working directory within the container
WORKDIR /var/www/html

# Copy the source code into the container's working directory
COPY src/ /var/www/html/src/
COPY public/ /var/www/html/
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Expose port 80
EXPOSE 80

# Enable hot reload by mounting a volume for the src directory
# This will allow changes made to the source code on the host machine to be reflected immediately in the container
VOLUME /var/www/html/src

# Set the entrypoint to Apache
CMD ["apache2-foreground"]
