# ---------------------------
# Stage 1: Build frontend
# ---------------------------
FROM node:18 AS builder

WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build production assets
RUN npm run build

# ---------------------------
# Stage 2: Serve with Nginx
# ---------------------------
FROM nginx:1.25-alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
#