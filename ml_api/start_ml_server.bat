# start_ml_server.bat (Windows)
@echo off
echo ========================================
echo Starting HomeSpark ML API Server
echo ========================================
echo.

cd ml_api

echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Checking if model file exists...
if exist home_renovation_model_package.pkl (
    echo [OK] Model file found
) else (
    echo [ERROR] Model file not found!
    echo Please copy home_renovation_model_package.pkl to ml_api folder
    pause
    exit /b 1
)

echo.
echo Starting server...
python main.py

pause
