FROM node:19

WORKDIR /usr/src/app

COPY . .

RUN npm ci --omit=dev

RUN mkdir -p /usr/src/app/data/documents

RUN mkdir -p /usr/src/app/data/thumbnails

CMD npm start