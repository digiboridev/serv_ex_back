# syntax=docker/dockerfile:1
   
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:ts
CMD ["npm", "run", "start"]
EXPOSE 3000
ENV PORT=3000