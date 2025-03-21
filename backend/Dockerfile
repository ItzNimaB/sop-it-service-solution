# NOT DONE YET

FROM node:20-alpine3.18 AS prod

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm install pm2 -g

CMD ["pm2-runtime", "ecosystem.config.js"]

EXPOSE 3000