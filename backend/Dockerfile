FROM node:20-alpine3.18 AS prod

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

RUN npm i tsc-alias -g

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm install pm2 -g

CMD ["sh", "-c", "npm run db:deploy && pm2-runtime ecosystem.config.js"]

EXPOSE 5000