FROM node:19

WORKDIR /usr/src/app

COPY . .

RUN npm ci --omit=dev

RUN mkdir /usr/src/app/documents

CMD npm start