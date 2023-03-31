FROM node:16-alpine AS builder

RUN npm i npm@latest -g

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --only=production
RUN npx prisma generate
RUN npx prisma migrate deploy

COPY . .

RUN npm run build

FROM node:16-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3333
CMD [ "npm", "run", "start:prod" ]