# Composer Build
FROM composer:1 as composer-build
WORKDIR /package
COPY composer.* ./
RUN composer install \
    --ignore-platform-reqs \
    --no-dev \
    --no-suggest \
    --no-scripts \
    --no-ansi \
    --no-progress \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --apcu-autoloader
COPY . /package
RUN composer dump-autoload \
    --no-dev \
    --no-scripts \
    --optimize \
    --classmap-authoritative \
    --apcu

# PHP Build
FROM php:7.4-fpm-alpine

ARG ENVIRONMENT=dev
RUN echo "Building with ENVIRONMENT=${ENVIRONMENT}"

WORKDIR /var/stories-server

RUN apk add --no-cache \
    bash \
    libcurl \
    curl-dev \
    libcrypto1.1 \
    libssl1.1 \
    freetype \
    libpng \
    libjpeg-turbo \
    freetype-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    libzip-dev \
    icu-dev \
    composer \
    git

RUN docker-php-ext-configure intl --enable-intl && \
    docker-php-ext-configure pdo_mysql --with-pdo_mysql && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install \
        zip \
        intl \
        mysqli \
        pdo \
        pdo_mysql \
        curl \
        gd \
        sockets \
        opcache

RUN apk add --update --no-cache --virtual .build-dependencies $PHPIZE_DEPS \
    && pecl install apcu \
    && docker-php-ext-enable apcu \
    && pecl clear-cache \
    && apk del .build-dependencies

COPY --from=composer-build /package/vendor ./vendor
COPY . .

COPY ./php-fpm/php.ini $PHP_INI_DIR/conf.d/
RUN if [ "$ENVIRONMENT" = "production" ] ; \
        then \
            cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" && \
            echo "allow_url_fopen = 0"  > "$PHP_INI_DIR/conf.d/docker-vars.ini" && \
            echo "expose_php = 0"  >> "$PHP_INI_DIR/conf.d/docker-vars.ini" && \
            echo "intl.error_level = E_WARNING"  >> "$PHP_INI_DIR/conf.d/docker-vars.ini" && \
            echo "max_input_time = 30"  >> "$PHP_INI_DIR/conf.d/docker-vars.ini" && \
            echo "max_execution_time = 30"  >> "$PHP_INI_DIR/conf.d/docker-vars.ini" ; \
    fi

EXPOSE 9000