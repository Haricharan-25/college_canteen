@echo off
setlocal
echo ========================================================
echo CampusBite - Online College Canteen Food Ordering System
echo Starting Spring Boot Backend (Port 8080)...
echo Database: MySQL (localhost:3306/campusbite_db)
echo ========================================================
echo.
cd /d "%~dp0backend"
mvn spring-boot:run
pause
