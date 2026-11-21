FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy maven wrapper / pom and source files
COPY pom.xml .
COPY src ./src

# Build production jar without tests
RUN apt-get update && apt-get install -y maven && mvn clean package -DskipTests

# Runtime image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
