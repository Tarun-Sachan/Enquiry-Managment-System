# Use Node LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy all backend code
COPY . .

# Expose port
EXPOSE 5000

# Start backend
CMD ["npm", "start"]
