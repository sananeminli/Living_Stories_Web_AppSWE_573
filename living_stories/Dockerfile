FROM maven:3.8.4-openjdk-17-slim
COPY . /living_stories
WORKDIR /living_stories
RUN mvn clean install -DskipTests
EXPOSE 8080
CMD ["java", "-jar", "target/living_stories-0.0.1.jar"]