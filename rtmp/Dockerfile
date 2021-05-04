FROM node:14-alpine

WORKDIR /home/rtmp

RUN apk add --no-cache ffmpeg

ENV PATH /home/rtmp/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm i

COPY . ./

CMD ["npm", "run", "dev"]
