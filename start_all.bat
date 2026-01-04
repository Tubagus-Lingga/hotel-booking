@echo off
echo Starting Hotel Booking System...

echo Launching Backend...
start "Hotel Booking Backend" start_backend.bat

echo Launching Frontend...
start "Hotel Booking Frontend" start_frontend.bat

echo Done! Windows have been opened for both services.
