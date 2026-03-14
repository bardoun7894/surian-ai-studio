FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    libicu-dev \
    libzip-dev

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd intl zip

# Install Redis extension via PECL
RUN pecl install redis && docker-php-ext-enable redis

# PHP upload limits for video files (up to 512MB)
RUN echo "upload_max_filesize=512M\npost_max_size=512M\nmemory_limit=512M\nmax_execution_time=300" > /usr/local/etc/php/conf.d/uploads.ini

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents
COPY . /var/www

# Permissions
RUN chown -R www-data:www-data /var/www

# Create non-root user for security
RUN groupadd -g 1000 appuser && useradd -u 1000 -g appuser -s /bin/sh appuser
RUN chown -R appuser:appuser /var/www

USER appuser

EXPOSE 9000
CMD ["php-fpm"]
