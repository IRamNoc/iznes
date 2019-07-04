# syntax=docker/dockerfile:1.0.0-experimental
# build
FROM node:carbon as build

RUN mkdir /root/.ssh/ \
    && touch /root/.ssh/known_hosts \
    && ssh-keyscan si-nexus01.dev.setl.io >> /root/.ssh/known_hosts \
    && mkdir -p /usr/src/

ADD ./src /usr/src/src
ADD ./angular.json /usr/src/
ADD ./package.json /usr/src/
ADD ./tsconfig.json /usr/src/

WORKDIR /usr/src

RUN --mount=type=ssh npm install
RUN npm install -g sass
RUN npm run build-prod

# deploy
FROM nginx:1-alpine

COPY --from=build /usr/src/dist /usr/share/nginx/html

COPY ./.docker/nginx.conf /etc/nginx/conf.d/default.conf
