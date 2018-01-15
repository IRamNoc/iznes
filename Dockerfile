FROM node:carbon

LABEL description="OpenCSD Frontend Docker Container"

RUN mkdir -p /usr/src/
WORKDIR /usr/src/

RUN apt-get -q update \
    && apt-get install -qy lsof nmap vim ruby-full rubygems \
    && gem install sass

EXPOSE 4200

CMD ["npm", "run", "docker"]
