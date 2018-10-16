FROM node

RUN npm install express --save

RUN mkdir /devtracker

WORKDIR /devtracker

COPY . /devtracker

EXPOSE 8080

cmd ["node", "index.js"]