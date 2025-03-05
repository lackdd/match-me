# Use Maven to build the backend
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set the working directory inside the container for backend
WORKDIR /app

# Copy pom.xml and backend source code
COPY pom.xml .
COPY src ./src

# Build the backend JAR file
RUN mvn clean install -DskipTests

# Use Node.js to build the frontend
FROM node:18 AS frontend-build

# Set the working directory for frontend
WORKDIR /frontend

# Copy frontend files and install dependencies
COPY client/package.json .
COPY client/package-lock.json .
RUN npm install

# Copy the frontend source code
COPY client/public ./public
COPY client/src ./src
COPY client ./

# Build the frontend
RUN npm run build

# Create the final image with both the backend JAR and frontend build
FROM eclipse-temurin:17-jre-alpine

# Install Node.js to run the frontend
RUN apk add --no-cache nodejs npm

# Set working directory inside the final container
WORKDIR /app

# Set the environment variable inside the container
ENV SPRING_FRONTEND_URL=$SPRING_FRONTEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV POSTGRES_URL=$POSTGRES_URL
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV POSTGRES_USERNAME=$POSTGRES_USERNAME
ENV VITE_GOOGLE_API=$VITE_GOOGLE_API
ENV VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY



# Copy the backend JAR file from the build stage
COPY --from=build /app/target/match-me-0.0.1-SNAPSHOT.jar /app/matchme.jar

# Copy the frontend build output (static files)
COPY --from=frontend-build /frontend/dist /app/frontend

# Install bash (optional, if needed)
RUN apk add --no-cache bash

# Copy the start.sh script
COPY ./start.sh /start.sh
RUN chmod +x /start.sh

# Expose the necessary ports for frontend and backend
EXPOSE 8080 5173

# Run both backend and frontend services
CMD ["/start.sh"]