FROM node:carbon

LABEL description="OpenCSD Frontend Docker Container"

RUN mkdir -p /usr/src/
WORKDIR /usr/src/
COPY . /usr/src/

RUN npm rebuild node-sass --force
RUN /usr/src/node_modules/node-sass/bin/node-sass /usr/src/src/styles.scss /usr/src/src/styles.css

EXPOSE 4200

CMD ["npm", "start"]
