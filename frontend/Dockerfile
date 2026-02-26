# Use a Node.js base image matching your local version
FROM node:18
# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Expose the frontend development server port (Vite)
EXPOSE 5173

# Start the frontend in development mode
CMD ["npm", "run", "dev"]
