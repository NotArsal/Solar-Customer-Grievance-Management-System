FROM node:26-alpine

# Set working directory
WORKDIR /app

# Set node environment to production
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install dependencies (only production deps)
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose API port
EXPOSE 5000

# Run server
CMD ["npm", "start"]
