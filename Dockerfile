FROM node:latest
MAINTAINER david.k.white@nordstrom.com

# Set the work directory
RUN mkdir -p /home/app/current
WORKDIR /home/app/current

# Add our package.json and install *before* adding our application files
ADD package.json ./

# Install pm2 so we can run our application
RUN npm install -g pm2@latest restify@latest aws-sdk@latest

# Add application files
ADD index.js ./

RUN npm install

CMD ["pm2", "start", "index.js", "--no-daemon"]
# the --no-daemon is a minor workaround to prevent the docker container from thinking pm2 has stopped running and ending itself
