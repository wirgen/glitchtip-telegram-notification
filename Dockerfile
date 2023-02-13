FROM node:16 as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install && yarn cache clean

COPY . ./

RUN yarn build


FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production && yarn cache clean

COPY --from=builder /app/build ./build

CMD ["yarn", "start"]