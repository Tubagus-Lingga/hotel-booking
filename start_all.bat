@echo off
echo Starting Hotel Booking System...

:: Start Backend (Spring Boot)
echo Starting Backend (Spring Boot)...
start "Hotel Booking Backend" cmd /k "cd hotel-booking && mvn spring-boot:run"

:: Start Frontend (Next.js)
echo Starting Frontend (Next.js)...
start "Hotel Booking Frontend" cmd /k "cd frontend && npm run dev"

echo System starting... Check the new terminal windows for logs.
