FROM node:16.5.0

WORKDIR /app

EXPOSE 23100

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

ENTRYPOINT node ./build
