FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache gettext
COPY package.json package-lock.json .env.example ./
RUN npm install
COPY src ./src
COPY openapi.yaml ./
COPY package.json package-lock.json .env.example ./
RUN envsubst < .env.example > .env
EXPOSE 5080
CMD ["sh", "-c", "envsubst < .env.example > .env && node src/index.js"]
