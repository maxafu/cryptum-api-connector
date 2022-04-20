FROM node:14-alpine

RUN apk update && apk add --update g++ make

RUN mkdir -p /app/node_modules
COPY package*.json /app/

# app infra repo
WORKDIR /app
RUN npm install
COPY . ./
RUN npm run build

EXPOSE 8080
CMD PORT=8080 npm run start
