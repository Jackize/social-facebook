# Use an official Node.js runtime as a parent image
FROM node:18-alpine as build

# Set the working directory in the container
WORKDIR /client

# Copy the package.json and package-lock.json files to the container
COPY package.json .

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Set environment variables
ENV VITE_BASE_URL=http://localhost:8080/api/
ENV VITE_CLOUD_NAME=dpbhp5ury
ENV VITE_CLOUD_PRESET=ml_default
ENV VITE_CLOUD_API_KEY=16892114678836
ENV VITE_CLOUD_API_SECRET=xyGefjjzHufGEcQDwyyjNUrR1tk
ENV VITE_SOCKET_SERVER=http://localhost:8080

# Serve the app using a static web server
RUN npm run build

FROM nginx
COPY --from=build /client/build /usr/share/nginx/html