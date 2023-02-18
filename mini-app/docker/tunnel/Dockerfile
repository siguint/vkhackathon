FROM node:16

WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm install @vkontakte/vk-miniapps-deploy --include=dev

# Copy the rest of the app files to the container
COPY --chown=node:node . .
USER node
# Start the tunnel
CMD ["npm", "run", "deploy"]
