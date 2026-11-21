@echo off
setlocal
echo ========================================================
echo CampusBite - Backend (Offline Demo Mode)
echo Running Spring Boot on Port 8080 with in-memory DB...
echo ========================================================
cd /d "%~dp0backend"
mvn spring-boot:run "-Dspring-boot.run.profiles=demo"
pause
