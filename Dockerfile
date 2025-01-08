FROM node:23.3.0-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

ENTRYPOINT ["tail", "-f", "/dev/null"]