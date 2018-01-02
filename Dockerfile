FROM node:carbon

LABEL description="OpenCSD Frontend Docker Container"

RUN mkdir -p /usr/src/
WORKDIR /usr/src/
COPY . /usr/src/

RUN npm install
RUN npm rebuild node-sass --force

EXPOSE 4200

CMD ["npm", "start"]
