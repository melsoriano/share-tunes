# Built from Node latest Alpine
FROM node:alpine

# Set the app directory as the context for all commands and entry to the container
WORKDIR /app/admin-server

# ONLY copy over the package.json to install NPM packages
COPY package.json /app/admin-server

# Install node module dependencies
RUN npm install

# Add the rest of the project files(most builds will start from here based on cache)
COPY . /app/admin-server

# Install firebase & firebase-admin libraries separately to avoid version-related crash at build time
RUN npm install firebase firebase-admin

# Install apk updates to allow for bash and vim manipulations
RUN apk update && apk upgrade

# Install bash
RUN apk add bash

# Install vim
RUN apk add vim

EXPOSE 8080

# Start the node application as you normally would
CMD ["npm", "run" "dev"]