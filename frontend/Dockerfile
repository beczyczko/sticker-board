FROM node:14

# A directory within the virtualized Docker environment
# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent \
    npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

RUN npm run build

# start app
CMD ["npm", "start"]