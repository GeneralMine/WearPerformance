FROM node:16.5.0

WORKDIR /api

EXPOSE 23101

COPY package*.json ./

RUN npm ci

COPY . .

ENTRYPOINT ["npm start"]