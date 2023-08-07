# syntax=docker/dockerfile:1
   
FROM node:20.4-buster
WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install

# Copy prisma schema and generate client
COPY /prisma ./prisma
RUN npm run build:prisma

# Copy source code and build typescript
COPY /src ./src
COPY tsconfig.json .
COPY .env .
RUN npm run build:ts

# run
CMD ["npm", "run", "start"]