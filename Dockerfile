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

FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

ARG JAR_FILE=target/match-me-0.0.1-SNAPSHOT.jar

COPY ${JAR_FILE} matchme.jar

ENTRYPOINT ["java","-jar","/app/matchme.jar"]

EXPOSE 8080