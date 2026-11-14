FROM node:22.23.4-alpine

WORKDIR /app

ENV PORT=3000

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main.js"]