# Built from Node latest Alpine
FROM node:10.12.0

# Set the app directory as the context for all commands and entry to the container
WORKDIR /app/admin-client

# ONLY copy over the package.json to install NPM packages
COPY package.json /app/admin-client

# Install node module dependencies
RUN npm install

# Add the rest of the project files(most builds will start from here based on cache)
COPY . /app/admin-client

# Start the node application as you normally would
CMD ["npm", "start"]

