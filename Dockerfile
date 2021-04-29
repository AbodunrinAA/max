FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app


WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . /usr/src/app

EXPOSE 4001
CMD [ "npm", "start" ]
