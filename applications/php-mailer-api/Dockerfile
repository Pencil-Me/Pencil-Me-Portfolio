# Use the official PHP 8.1 image as the base
FROM php:8.1-apache

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

RUN apt-get update && apt-get install -y \
    unzip \
    zip \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN sed -i 's|/var/www/html|/var/www/html/src|g' /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

COPY src/ ./src/

RUN mkdir -p src/logs && chown -R www-data:www-data src/logs

COPY src/Inc/.env.example /var/www/html/src/Inc/.env.example

EXPOSE 80

CMD ["apache2-foreground"]
