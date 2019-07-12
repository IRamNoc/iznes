# syntax=docker/dockerfile:1.0.0-experimental
# build
FROM node:10 as builder

# set working directory
RUN mkdir /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# add to our gitlab know hosts for ssh agent
RUN mkdir /root/.ssh/ \
    && touch /root/.ssh/known_hosts \
    && ssh-keyscan si-nexus01.dev.setl.io >> /root/.ssh/known_hosts \

WORKDIR /app
# install and cache app dependencies
COPY package.json /app/package.json

# --mount-type=ssh allow us to use ssh from host.
RUN --mount=type=ssh cd /app && npm install
RUN npm install -g sass

# add app
COPY . /app
WORKDIR /app

# generate build
RUN npm run build-prod

# production
# base image
FROM nginx:1.13.9-alpine

# copy artifact build from the 'build environment'
COPY --from=builder /app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
