FROM node:14

WORKDIR /home/web

ENV PATH /home/web/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm i

COPY . ./

CMD ["npm", "start"]
