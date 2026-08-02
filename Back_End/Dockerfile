# Base Image
FROM node:24-alpine

# Create app directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose application port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
