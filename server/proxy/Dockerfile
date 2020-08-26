FROM nginx:alpine
WORKDIR /var/www
COPY ./proxy/nginx.conf /etc/nginx/conf.d/default.conf
COPY . /var/stories-server