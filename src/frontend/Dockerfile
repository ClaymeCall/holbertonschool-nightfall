# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json .env.example ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["sh", "-c", "envsubst '$$REACT_APP_API_URL' < /usr/share/nginx/html/static/js/*.js > /usr/share/nginx/html/static/js/temp.js && mv /usr/share/nginx/html/static/js/temp.js /usr/share/nginx/html/static/js/*.js && nginx -g 'daemon off;'"]