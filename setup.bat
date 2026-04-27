@echo off
setlocal enabledelayedexpansion

cd /d "c:\Users\Sai Vatsal\Desktop\hub"

REM Create directories
if not exist "config" mkdir "config"
if not exist "src" mkdir "src"
if not exist "public" mkdir "public"

echo Directories created

REM Create config.js
(
echo require('dotenv').config^(^);
echo.
echo module.exports = {
echo   PORT: process.env.PORT ^|^| 8000,
echo   HOST: process.env.HOST ^|^| 'localhost',
echo   NODE_ENV: process.env.NODE_ENV ^|^| 'development',
echo   LOG_LEVEL: process.env.LOG_LEVEL ^|^| 'info',
echo };
) > "config\config.js"

echo Created config\config.js

REM Create logger.js
(
echo const config = require^('../config/config'^);
echo.
echo const LOG_LEVELS = {
echo   error: 0,
echo   warn: 1,
echo   info: 2,
echo   debug: 3,
echo };
echo.
echo const getCurrentLevel = ^(^) =^> LOG_LEVELS^[config.LOG_LEVEL^] ^|^| LOG_LEVELS.info;
echo.
echo const log = ^(level, message, data = ''^ =^> {
echo   const timestamp = new Date^(^).toISOString^(^);
echo   const levelNum = LOG_LEVELS^[level^] ^|^| 2;
echo.
echo   if ^(levelNum ^<= getCurrentLevel^(^)^ {
echo     const output = data ? `^[${timestamp}^] ${level.toUpperCase^(^)}:^ ${message} ^| ${JSON.stringify^(data^)}` : `^[${timestamp}^] ${level.toUpperCase^(^)}:^ ${message}`;
echo     if ^(level === 'error'^ {
echo       console.error^(output^);
echo     } else {
echo       console.log^(output^);
echo     }
echo   }
echo };
echo.
echo module.exports = {
echo   error: ^(msg, data^ =^> log^('error', msg, data^),
echo   warn: ^(msg, data^ =^> log^('warn', msg, data^),
echo   info: ^(msg, data^ =^> log^('info', msg, data^),
echo   debug: ^(msg, data^ =^> log^('debug', msg, data^),
echo };
) > "src\logger.js"

echo Created src\logger.js
echo Setup complete!
