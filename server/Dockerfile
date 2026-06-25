FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code (this is mostly overridden by volume mounting in dev, but good practice)
COPY . .

# Expose API port
EXPOSE 5000

# Run dev server with nodemon
CMD ["npm", "run", "dev"]
