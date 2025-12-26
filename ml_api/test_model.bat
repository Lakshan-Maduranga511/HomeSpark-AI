@echo off
echo ========================================
echo Testing NMF+KMeans Model
echo ========================================
echo.

cd ml_api

echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Running tests...
python test_model.py

pause