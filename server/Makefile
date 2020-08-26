ROOT=.
VENDOR=$(ROOT)/vendor
PHP_CONF=$(ROOT)/php-fpm
SRC=$(ROOT)/src

PHP_CONTAINER=stories-php

up:
	docker-compose up

down:
	docker-compose down

composer-update:
	docker exec -it $(PHP_CONTAINER) composer update

phpstan:
	docker exec -it $(PHP_CONTAINER) bash -c \
		"$(VENDOR)/bin/phpstan \
			analyse src \
			--level max \
			-c $(PHP_CONF)/phpstan.neon \
			--memory-limit=1G"

dump:
	mysqldump \
		-h 127.0.0.1 \
		-P 6306 \
		-u root \
		-pLmx82yFCKrWFYUs \
		--column-statistics=0 \
		stories_db > /tmp/stories_db.sql

restore:
	mysql \
		-h 127.0.0.1 \
		-P 6306 \
		-u root \
		-pLmx82yFCKrWFYUs \
        stories_db < /tmp/stories_db.sql
