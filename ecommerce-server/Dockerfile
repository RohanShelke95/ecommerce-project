# Build stage using Maven and JDK 17
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and download dependencies to cache them
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build the package
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage using lightweight JRE 17
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar file from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose backend port
EXPOSE 5454

# Command to execute the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
