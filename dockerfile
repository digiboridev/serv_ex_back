# syntax=docker/dockerfile:1
   
FROM node:20.4-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:ts
CMD ["npm", "run", "start"]
