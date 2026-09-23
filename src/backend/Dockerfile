FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY src ./src
COPY openapi.yaml ./

EXPOSE 5080
# Seed the demo dataset (idempotent: wipes then re-inserts) before starting
# the server, so a fresh `docker compose up` is immediately demoable and a
# restart never produces duplicate rows.
CMD ["sh", "-c", "node src/utils/seed.js && npm run dev"]
