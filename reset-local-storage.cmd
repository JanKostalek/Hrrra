@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0reset-local-storage.ps1"
exit /b %errorlevel%
