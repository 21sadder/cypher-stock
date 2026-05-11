FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src
RUN chmod +x mvnw
RUN ./mvnw package -DskipTests
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/SpkTeam-0.0.1-SNAPSHOT.jar"]