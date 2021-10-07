FROM node:14

WORKDIR /home/web

ENV PATH /home/web/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

EXPOSE 3000

CMD ["npm", "run", "dev", "--host"]
