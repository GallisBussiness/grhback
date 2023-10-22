# Base image
FROM node:20-alpine3.17

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install -g npm
RUN npm install -g rimraf
# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

RUN npm prune

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
