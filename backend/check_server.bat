@echo off
echo Checking AgriGuru Backend Server Status...
echo.
cd /d "%~dp0"
python check_server.py
echo.
echo Press any key to exit...
pause >nul
