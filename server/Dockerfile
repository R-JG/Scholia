FROM node:19

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
COPY build .

RUN npm ci --only=production

CMD npm start