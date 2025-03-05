# Use Node.js to build the frontend
FROM node:18 AS frontend-build

WORKDIR /frontend

# Copy frontend source code and install dependencies
COPY package.json package-lock.json ./
RUN npm install
COPY ./

# Build the frontend (with environment variables)
ARG VITE_BACKEND_URL
ARG VITE_GOOGLE_API
ARG VITE_GOOGLE_API_KEY

ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_GOOGLE_API=${VITE_GOOGLE_API}
ENV VITE_GOOGLE_API_KEY=${VITE_GOOGLE_API_KEY}

RUN npm run build

# Final image with Node.js and serve to serve the frontend
FROM node:18-slim

WORKDIR /app

# Install 'serve' globally to serve static files
RUN npm install -g serve

# Copy the frontend build output to the container
COPY --from=frontend-build /frontend/dist /app

# Expose the port for serving the frontend
EXPOSE 5173

# Start the frontend using 'serve'
CMD ["serve", "-s", "dist", "-l", "5173"]