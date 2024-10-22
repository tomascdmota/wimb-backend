# Use the base Node.js image
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy .env file (ensure this is not ignored in .dockerignore)
COPY .env .env

# Expose the necessary port
EXPOSE 4001

# Ensure the image folder is created
RUN mkdir -p /usr/src/app/uploads

# Make sure this folder persists in case of restarts
VOLUME /usr/src/app/uploads

# Start the application
CMD ["npm", "run", "start:prod"]
