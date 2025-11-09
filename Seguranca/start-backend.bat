@echo off
title Backend - Cifra de Cesar (Porta 5000)

echo ============================================
echo  Iniciando Backend (Node.js + MongoDB)
echo ============================================
echo.

cd /d "%~dp0cifra_cesar"

echo Verificando MongoDB...
sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
    echo AVISO: MongoDB pode nao estar rodando!
    echo Tente: net start MongoDB
    echo.
)

echo Iniciando servidor...
echo Backend rodara em: http://localhost:5000
echo.
echo Pressione CTRL+C para parar o servidor
echo ============================================
echo.

npm start
