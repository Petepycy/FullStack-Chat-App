FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install -g @angular/cli@12.2.0

RUN npm install
EXPOSE 4200
COPY . .

CMD ["ng", "serve", "--host", "0.0.0.0"]