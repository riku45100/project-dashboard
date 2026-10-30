@echo off
rem Build and preview the React frontend locally on Windows.
rem Usage: scripts\build-local.cmd
setlocal

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js 22 or later, then retry.
  exit /b 1
)

cd /d "%~dp0..\frontend"

if not exist package-lock.json (
  echo Installing dependencies...
  call npm install
) else (
  echo Installing dependencies from package-lock.json...
  call npm ci
)
if errorlevel 1 exit /b 1

echo Running TypeScript checks...
call npm run typecheck
if errorlevel 1 exit /b 1

echo Building production bundle...
call npm run build
if errorlevel 1 exit /b 1

echo Starting local preview at http://localhost:4173
call npm run preview -- --host
