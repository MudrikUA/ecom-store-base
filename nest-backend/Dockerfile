# --- STAGE 1: Build the NestJS application ---
# Використовуємо офіційний образ Node.js для компіляції
FROM node:20-alpine AS build
WORKDIR /app
# Копіюємо залежності та встановлюємо їх
COPY package*.json ./
RUN npm install
# Копіюємо вихідний код і запускаємо білд
COPY . .
RUN npm run build 
# --- STAGE 2: Run the application in a clean Node environment ---
# Використовуємо чистий, легший образ для продакшену
FROM node:20-alpine AS production
WORKDIR /app
# Копіюємо тільки файли залежностей (package*.json) та встановлюємо їх *без* devDependencies
COPY package*.json ./
RUN npm install --only=production
# Копіюємо скомпільований код з першого етапу
COPY --from=build /app/dist ./dist
#COPY --from=build /app/static ./dist/static
RUN mkdir -p ./dist/static
# Документуємо порт, який слухає NestJS додаток (зазвичай 3000)
EXPOSE 3000
# Команда запуску продакшену
CMD ["node", "dist/main.js"] 
# Або якщо у вас є скрипт start:prod у package.json:
# CMD ["npm", "run", "start:prod"]