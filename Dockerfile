FROM node:12

WORKDIR /usr/src/pmt-node-app

COPY package*.json ./

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN yarn install

COPY . .

EXPOSE 3333:3333

CMD [ "yarn", "dev" ]
