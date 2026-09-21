FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json .env.example ./
RUN npm install -g envsubst && npm install
COPY . .
RUN envsubst < .env.example > .env
EXPOSE 5000
CMD ["sh", "-c", "envsubst < .env.example > .env && npm start"]