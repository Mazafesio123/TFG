FROM node:15.14.0-alpine 

WORKDIR /usr/app

COPY package*.json ./

USER root

RUN npm install

# RUN npm rebuild bcrypt --build-from-source

COPY . .

CMD ["npm", "run", "start"]