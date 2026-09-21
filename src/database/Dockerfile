FROM mysql:8.0

# Copy environment file
COPY .env.example /docker-entrypoint-initdb.d/

# Set environment variables
ENV MYSQL_DATABASE=${MYSQL_DATABASE}
ENV MYSQL_USER=${MYSQL_USER}
ENV MYSQL_PASSWORD=${MYSQL_PASSWORD}
ENV MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}

# Expose MySQL port
EXPOSE 3306

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/

# Start MySQL
CMD ["mysqld"]