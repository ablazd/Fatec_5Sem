@echo off
title Frontend - Cifra de Cesar (Porta 5173)

echo ============================================
echo  Iniciando Frontend (React + Vite)
echo ============================================
echo.

cd /d "%~dp0cifra"

echo Iniciando servidor de desenvolvimento...
echo Frontend rodara em: http://localhost:5173
echo.
echo Pressione CTRL+C para parar o servidor
echo ============================================
echo.

npm run dev
