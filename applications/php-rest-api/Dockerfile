# Use the official PHP 8.3 image as the base
FROM php:8.3-apache

# Set the ServerName directive to suppress AH00558 message
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Set the DocumentRoot to the public directory
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    curl \
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

# Log-Verzeichnis (Monolog) — Volume auf src/ ueberschreibt sonst ohne logs/
RUN mkdir -p /var/www/html/src/logs \
    && chown -R www-data:www-data /var/www/html/src/logs

# Fallback-Env fuer Builds ohne gemountete .env.dev (Compose mountet src/Inc/.env.dev)
COPY src/Inc/.env.example /var/www/html/src/Inc/.env.example

# Expose port 80
EXPOSE 80

# Set the entrypoint to Apache
CMD ["apache2-foreground"]
