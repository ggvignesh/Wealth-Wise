@echo off
title WealthWise - Local Dev Server
color 0A

echo.
echo  ██╗    ██╗███████╗ █████╗ ██╗  ████████╗██╗  ██╗██╗    ██╗██╗███████╗███████╗
echo  ██║    ██║██╔════╝██╔══██╗██║  ╚══██╔══╝██║  ██║██║    ██║██║██╔════╝██╔════╝
echo  ██║ █╗ ██║█████╗  ███████║██║     ██║   ███████║██║ █╗ ██║██║███████╗█████╗
echo  ██║███╗██║██╔══╝  ██╔══██║██║     ██║   ██╔══██║██║███╗██║██║╚════██║██╔══╝
echo  ╚███╔███╔╝███████╗██║  ██║███████╗██║   ██║  ██║╚███╔███╔╝██║███████║███████╗
echo   ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝╚══════╝╚══════╝
echo.
echo  Smart Finance, Smarter You
echo  -------------------------------------------------------
echo.

REM ---- Step 1: Check MySQL ----
echo [1/4] Checking MySQL...
mysql --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo  ERROR: MySQL not found. Please install MySQL and add it to PATH.
    pause
    exit /b
)
echo  MySQL found.

REM ---- Step 2: Setup Database ----
echo.
echo [2/4] Setting up database...
echo  Enter your MySQL root password when prompted:
mysql -u root -p < database_setup.sql
IF ERRORLEVEL 1 (
    echo  WARNING: Database may already exist. Continuing...
)
echo  Database ready.

REM ---- Step 3: Start Flask Backend ----
echo.
echo [3/4] Starting Flask backend on http://localhost:5000 ...
cd backend

IF NOT EXIST ".env" (
    copy .env.example .env
    echo  Created .env from .env.example
    echo  IMPORTANT: Edit backend\.env and set your MySQL password!
    notepad .env
    pause
)

pip install -r requirements.txt --quiet
start "WealthWise Backend" cmd /k "python app.py"
cd ..
timeout /t 3 /nobreak >nul

REM ---- Step 4: Start React Frontend ----
echo.
echo [4/4] Starting React frontend on http://localhost:3000 ...
cd frontend
call npm install --silent
start "WealthWise Frontend" cmd /k "npm start"
cd ..

echo.
echo  -------------------------------------------------------
echo  WealthWise is starting up!
echo.
echo  Frontend:  http://localhost:3000
echo  Backend:   http://localhost:5000
echo  API Docs:  http://localhost:5000/api
echo  -------------------------------------------------------
echo.
echo  Both server windows have opened. Wait ~15 seconds for React to compile.
echo  Your browser will open automatically.
echo.
pause
