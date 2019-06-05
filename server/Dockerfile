# Built from Node latest Alpine
FROM node:11.15.0-alpine

# Set the app directory as the context for all commands and entry to the container
WORKDIR /app/admin-server

# ONLY copy over the package.json to install NPM packages
COPY package.json /app/admin-server

# Install node module dependencies
RUN npm install

# Add the rest of the project files(most builds will start from here based on cache)
COPY . /app/admin-server

# Start the node application as you normally would
CMD ["npm", "run" "dev"]