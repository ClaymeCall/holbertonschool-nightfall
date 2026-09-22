FROM mysql:8.0

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/

# Start MySQL (runs as mysql user by default)
CMD ["mysqld"]