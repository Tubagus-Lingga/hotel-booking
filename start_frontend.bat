@echo off
cd frontend
echo Installing dependencies...
call npm install
echo Starting frontend...
call npm run dev
pause
