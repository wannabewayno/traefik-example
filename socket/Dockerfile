# The build image
FROM node:lts AS build
RUN apt-get update && apt-get upgrade -y
WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci --only=production && \
   rm -f .npmrc

# The production image
FROM node:lts-bullseye-slim

ENV NODE_ENV production
# this where we would also copy chrome and set an env variable for it's path
# COPY --from=build /usr/bin/chromium-stable /usr/bin/chromium-stable
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . .
CMD ["node", "server.js"]
