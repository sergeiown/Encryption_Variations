@echo off

echo Writing text from the keyboard or from the file input.txt ?
echo.
echo 1. From keyboard
echo 2. From file input.txt
echo.

choice /c 12 /n /m "Enter your choice: "

if errorlevel 2 (
    echo.
    echo You chose to read from file input.txt
    node base64FromFile.js
    echo.
    pause
) else (
    echo.
    echo You chose to enter text from the keyboard
    node base64.js
)
