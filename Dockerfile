FROM node:carbon

LABEL description="OpenCSD Frontend Docker Container"

RUN mkdir -p /usr/src/
WORKDIR /usr/src/
COPY . /usr/src/

EXPOSE 4200

CMD ["npm", "run", "docker"]
