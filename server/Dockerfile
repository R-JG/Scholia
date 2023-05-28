FROM node:19

WORKDIR /usr/src/app

COPY . .

RUN npm ci --omit=dev

RUN mkdir /documents

CMD npm start