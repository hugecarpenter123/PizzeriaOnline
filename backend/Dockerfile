FROM openjdk:19-jdk

WORKDIR /app

# to check
ENV IMAGE_UPLOAD_FOLDER=/app/images

COPY target/PizzeriaBackend-0.0.1.jar /app/PizzeriaBackend-0.0.1.jar
COPY images /app/images

EXPOSE 8082

CMD ["java", "-jar", "PizzeriaBackend-0.0.1.jar"]
