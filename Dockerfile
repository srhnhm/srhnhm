# BUILD-USING: docker build -t lever/static .
# RUN-USING: docker run -it -p 4000:4000 lever/static

FROM lever/base

ADD package.json /var/lever/static/
ADD server.coffee /var/lever/static/
ADD public /var/lever/static/public
ADD styles /var/lever/static/styles
# The makefile isn't used.

WORKDIR /var/lever/static

RUN npm install
RUN coffee -bc server.coffee

EXPOSE 4000

CMD ["/usr/local/bin/node", "/var/lever/static/server.js"]

