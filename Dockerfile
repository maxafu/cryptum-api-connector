FROM node:16 AS builder

WORKDIR /app
RUN apt-get update && apt-get install -y

RUN mkdir -p /app/node_modules
COPY package.json /app/

# app infra repo
RUN npm install
COPY . ./
RUN npm run build

EXPOSE 8080

ENTRYPOINT ["node", "/app/dist/main.js"]
