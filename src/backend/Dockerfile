FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY src ./src
COPY openapi.yaml ./

EXPOSE 5080
CMD ["npm", "run", "dev"]
