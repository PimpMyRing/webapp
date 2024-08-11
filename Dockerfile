# Use the official Node.js 20 image as the base image
FROM node:20-alpine

# Install Yarn (Uncomment the next line if Yarn is not included in the Node image)
RUN apk add --no-cache yarn

# Set up env variables
ARG SECRET_ALCHEMY_API_KEY

ENV REACT_APP_ALCHEMY_API_KEY=$SECRET_ALCHEMY_API_KEY

# Set the working directory to /app
WORKDIR /app

# Copy the package.json, yarn.lock, and tsconfig.json files to the container
# Note: Make sure you have a yarn.lock file, if not, generate it by running 'yarn install' on your local machine
COPY package.json yarn.lock tsconfig.json ./

# Install the dependencies
RUN yarn install --frozen-lockfile && yarn cache clean

# Copy the rest of the application code to the container
COPY . .

# Expose port 3000
EXPOSE 8080

# Build the React application
RUN yarn build

# Set the command to start the React application using the build folder
CMD ["yarn", "serve", "-s", "build", "-l", "8080"]
