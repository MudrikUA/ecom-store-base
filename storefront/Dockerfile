# --- STAGE 1: Build the React application ---
FROM node:20-alpine AS build
WORKDIR /app

# Додайте цю стрічку, щоб отримати аргумент з compose файлу
ARG REACT_APP_API_URL 
# Встановлюємо ARG як ENV VAR, щоб npm run build її побачив
ENV REACT_APP_API_URL=$REACT_APP_API_URL 

COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build 

# --- STAGE 2: Serve the static files with Nginx ---
FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]