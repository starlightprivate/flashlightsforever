FROM node:6.9.4

RUN mkdir -p /opt/frontend
VOLUME /opt/frontend

RUN mkdir -p /app
ADD package.json /app/package.json

WORKDIR /app
RUN npm install

ADD . /app
RUN npm run-script build

# it fails because i do not have account on snyk
# RUN npm test

CMD ["npm","start"]