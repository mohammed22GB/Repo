# Stage 1: Build Stage
FROM node:18.20.7 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock for dependency installation
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --force

# Copy the entire application source code
COPY . .

# Expose port 3000 for development
EXPOSE 3000

# Default command to run the development server
CMD ["yarn", "start"]
