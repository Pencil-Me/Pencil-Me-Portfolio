# Create from official mysql image
FROM mysql:8

# Add a database
ENV MYSQL_DATABASE portfolio_db
ENV MYSQL_USER user
ENV MYSQL_PASSWORD test
ENV MYSQL_RANDOM_ROOT_PASSWORD yes

# Initial db scripts
COPY ./init-scripts /docker-entrypoint-initdb.d/