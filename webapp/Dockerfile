# pull official base image
FROM node:15.11-alpine

#create home dir with user node access
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# set workdir and become user
WORKDIR /home/node/app
USER node

# need to chown those as well
COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./
RUN npm install

# add app - yay, chown
COPY --chown=node:node . .

# start app
CMD ["npm", "start"]
