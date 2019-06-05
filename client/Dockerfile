# Built from Node latest Alpine
FROM node:alpine

# Set the app directory as the context for all commands and entry to the container
WORKDIR /app/admin-client

# ONLY copy over the package.json to install NPM packages
COPY package.json /app/admin-client

# Install node module dependencies
RUN npm install

# Add the rest of the project files(most builds will start from here based on cache)
COPY . /app/admin-client

# Install apk updates to allow for bash and vim manipulations
RUN apk update && apk upgrade

# Install bash
RUN apk add bash

# Install vim
RUN apk add vim

# Start the node application as you normally would
CMD ["npm", "start"]

