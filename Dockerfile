FROM node:10-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY ./package.json .
RUN yarn install --silent
COPY . ./
EXPOSE 3000
CMD node server/server.js