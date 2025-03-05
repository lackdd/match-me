## First stage: Build the JAR file
#FROM maven:3.9.6-eclipse-temurin-21 AS build
#WORKDIR /app
#COPY pom.xml .
#COPY src ./src
#RUN mvn clean package -DskipTests
#
## Second stage: Run the JAR file with a smaller image
#FROM eclipse-temurin:21-jdk-alpine
#WORKDIR /app
#COPY --from=build /app/target/match-me-0.0.1-SNAPSHOT.jar app.jar
#EXPOSE 8080
#ENTRYPOINT ["java", "-jar", "/app/app.jar"]

#FROM eclipse-temurin:21-jdk-alpine
#
#WORKDIR /app
#
##ENV SPRING_FRONTEND_URL=https://match-me-frontend.onrender.com
#
#ARG JAR_FILE=target/match-me-0.0.1-SNAPSHOT.jar
#
#COPY ${JAR_FILE} matchme.jar
#
#ENTRYPOINT ["java","-jar","/app/matchme.jar"]
#
#EXPOSE 8080

# Use Maven to build the app
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and other necessary files for Maven to download dependencies
COPY pom.xml .

# Download the dependencies
RUN mvn dependency:go-offline

# Copy the source code into the container
COPY src ./src

# Build the JAR file
RUN mvn clean install -DskipTests

# Create the final image with the JAR file
FROM eclipse-temurin:17-jre-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/match-me-0.0.1-SNAPSHOT.jar matchme.jar

# Define the entrypoint for the application
ENTRYPOINT ["java", "-jar", "/app/matchme.jar"]

EXPOSE 8080