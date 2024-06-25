@echo off

echo Which method do you want to use?
echo.
echo 1. Base64
echo.
echo 2. XOR
echo.

choice /c 12 /n /m "Enter your choice: "

if errorlevel 2 (
    echo.
    echo You chose XOR encoding/decoding.
    set text=xor.js
    set file=xorFromFile.js
) else (
    echo.
    echo You chose Base64 encoding/decoding.
    set text=base64.js
    set file=base64FromFile.js
)

timeout /t 2 /nobreak > nul
cls

echo.
echo Do you want to read input from the keyboard or from the file input.txt?
echo.
echo 1. From keyboard
echo.
echo 2. From file input.txt
echo.

choice /c 12 /n /m "Enter your choice: "

if errorlevel 2 (
    echo.
    echo You chose to read from file input.txt.
    timeout /t 2 /nobreak > nul
    cls
    node %file%
    echo.
    pause
) else (
    echo.
    echo You chose to enter text from the keyboard.
    timeout /t 2 /nobreak > nul
    cls
    node %text%
)




