# this is where docker gets the image from
FROM node:latest

# code executes in the command line INSIDE the docker container
RUN mkdir -p /usr/app

# set your working directory so that . is now /usr/src/app
WORKDIR /usr/app

# this copies everything you need into from local into your docker container to start
COPY ./src /usr/app/src/
COPY ./public /usr/app/public/
COPY ./package*.json /usr/app/

# set up your docker environment with nodemon
RUN npm install -g nodemon
RUN npm i


# this command defaults to start our node server
# however, our compose file over writes this so we get reloading
# the reason we put this here is so that production would start
CMD ["node", "./src/backend/server.js"]