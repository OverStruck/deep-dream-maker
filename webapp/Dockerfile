# pull official base image
FROM node:15.11-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app


WORKDIR /home/node/app

USER node

COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./
RUN npm install

# set working directory
#WORKDIR /home/node
# add `/app/node_modules/.bin` to $PATH
#ENV PATH /home/node/node_modules/.bin:$PATH
# install app dependencies

# To Fix Permissions for Packages
#RUN npm config set unsafe-perm true

#RUN npm install
#RUN mkdir /app/node_modules/.cache && chmod -R 777 /app/node_modules/.cache

#RUN chown -R node /app/node_modules

#RUN mkdir -p /app/node_modules/.cache && chmod -R 777 /app/node_modules/.cache

# add app
COPY --chown=node:node . .

#USER node
# start app
CMD ["npm", "start"]
