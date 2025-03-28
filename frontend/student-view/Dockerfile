# NOT DONE YET

FROM node:20-alpine3.18 AS prod

ENV NODE_ENV=production

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .