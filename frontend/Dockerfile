# Stage 1: Build the frontend
FROM node:18 AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend files
COPY . .

# Build the Vite + TS project
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Copy custom nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
