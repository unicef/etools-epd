FROM node:12.22.7-alpine3.12 as builder
RUN apk update
RUN apk add --update bash

RUN apk add git
RUN npm config set unsafe-perm true
RUN npm install -g --unsafe-perm polymer-cli
RUN npm install -g typescript@4.x


WORKDIR /tmp
ADD package.json /tmp/
ADD package-lock.json /tmp/

RUN npm ci --only=prod

ADD . /code/
WORKDIR /code
RUN rm -rf node_modules
RUN cp -a /tmp/node_modules /code/node_modules

WORKDIR /code
RUN npm run build

FROM node:12.22.7-alpine3.12
RUN apk update
RUN apk add --update bash

WORKDIR /code
RUN npm install express@4.17.x
RUN npm install browser-capabilities@1.1.x
COPY --from=builder /code/express.js /code/express.js
COPY --from=builder /code/build /code/build
EXPOSE 8080
CMD ["node", "express.js"]
