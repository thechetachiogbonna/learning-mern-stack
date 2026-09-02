FROM node:lts-alpine3.24 AS build

WORKDIR /app

USER node

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM build AS production

COPY --from=build --chown=node:node /app/dist/src /app

COPY --chown=node:node  package*.json /app/

EXPOSE 3000

CMD ["node", "index.js"]