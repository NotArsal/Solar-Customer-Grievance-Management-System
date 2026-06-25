FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code (overridden by volume mount in local dev)
COPY . .

# Expose Vite port
EXPOSE 5173

# Start Vite with host flag so it's accessible from the host machine
CMD ["npm", "run", "dev", "--", "--host"]
