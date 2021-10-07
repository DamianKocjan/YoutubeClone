FROM node:12-alpine AS frontend

WORKDIR /app

COPY . ./

RUN npm install
RUN npm rum build

ENTRYPOINT ["npm", "start"]
