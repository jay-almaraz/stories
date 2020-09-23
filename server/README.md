# Stories Server

Sole entrypoint is found in `index.php`, all code follows from there.

## Local Dev

1. `docker-compose up`
2. Access API at `http://localhost:6080/`
3. Access Adminer at `http://localhost:6001/`

## Deployment

1. `git pull`
2. `ENVIRONMENT=prod docker-compose up -d`
3. Access API at `http://45.77.237.8:6080/`
4. Access Adminer at `http://45.77.237.8:6001/`