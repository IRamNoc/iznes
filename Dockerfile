FROM node:carbon

LABEL description="OpenCSD Frontend Docker Container"

RUN mkdir -p /usr/src/
WORKDIR /usr/src/
COPY . /usr/src/

RUN apt-get update \
    && apt-get install -y lsof nmap vim

EXPOSE 4200

CMD ["npm", "run", "docker"]
