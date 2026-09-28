@echo off
echo ============================================================
echo   Compilando KAIRÓS con motor GO (Single Executable)
echo ============================================================

REM 1. Compilar Frontend a HTML/CSS/JS optimizado
echo [*] Compilando frontend React...
call npm run build

REM 2. Compilar servidor Go a ejecutable nativo
echo [*] Compilando binario Go nativo (kairos.exe)...
where go >nul 2>nul
if %ERRORLEVEL% equ 0 (
    go build -o kairos.exe .
) else (
    "C:\Program Files\Go\bin\go.exe" build -o kairos.exe .
)

if exist "kairos.exe" (
    echo.
    echo ============================================================
    echo [EXITO] KAIRÓS compilado con exito como binario nativo: kairos.exe
    echo Puedes ejecutarlo haciendo doble clic en kairos.exe sin necesidad de NPM!
    echo ============================================================
) else (
    echo.
    echo [ERROR] No se pudo compilar kairos.exe
)
pause
