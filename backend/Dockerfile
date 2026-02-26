# Use a Node.js base image matching your local version
FROM node:18

RUN npm install -g nodemon

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the backend port
EXPOSE 4000

# Start the backend
CMD ["npm", "start"]
