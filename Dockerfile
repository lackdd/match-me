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

# Set working directory inside the final container
WORKDIR /app

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