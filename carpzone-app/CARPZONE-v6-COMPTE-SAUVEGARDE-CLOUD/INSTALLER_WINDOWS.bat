@echo off
REM ============================================
REM CARPZONE - Installateur Windows
REM ============================================

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════╗
echo ║    CARPZONE - Application Installer    ║
echo ║     Analyse. Prepare. Capture.         ║
echo ╚════════════════════════════════════════╝
echo.

echo.
echo Verification de Python...
python --version >nul 2>&1

if errorlevel 1 (
    echo ❌ Python n'est pas installe ou n'est pas dans le PATH
    echo.
    echo Solutions:
    echo 1. Installer Python depuis: https://www.python.org/downloads/
    echo 2. Cocher "Add Python to PATH" lors de l'installation
    echo 3. Redemarrer ce script apres l'installation
    echo.
    pause
    exit /b 1
)

echo ✅ Python trouve
echo.

echo Demarrage du serveur CARPZONE...
echo.
echo ╔════════════════════════════════════════╗
echo ║  http://localhost:8000                 ║
echo ║                                        ║
echo ║  Ouvrez l'URL ci-dessus dans votre     ║
echo ║  navigateur pour acceder a l'app       ║
echo ║                                        ║
echo ║  Appuyez sur Ctrl+C pour arreter       ║
echo ╚════════════════════════════════════════╝
echo.

REM Lancer le serveur Python
python -m http.server 8000

if errorlevel 1 (
    echo ❌ Erreur au lancement du serveur
    echo.
    echo Essayez la commande:
    echo python -m SimpleHTTPServer 8000
    echo.
    pause
    exit /b 1
)

pause
