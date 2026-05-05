@echo off
chcp 65001 >nul
title Simulador Hemosphere — Servidor Local
cd /d "%~dp0"
echo ============================================================
echo   Simulador Hemosphere — Servidor HTTP local
echo ============================================================
echo.
echo Pasta:  %CD%
echo URL:    http://localhost:8000
echo.
echo Abrindo o navegador em http://localhost:8000 ...
start "" "http://localhost:8000"
echo.
echo Iniciando servidor Python na porta 8000.
echo Para encerrar, feche esta janela ou pressione CTRL+C.
echo ============================================================
echo.

REM Tenta python primeiro, depois py (Windows launcher)
where python >nul 2>nul
if %errorlevel%==0 (
    python -m http.server 8000
    goto :end
)
where py >nul 2>nul
if %errorlevel%==0 (
    py -m http.server 8000
    goto :end
)

REM Tenta node como fallback
where node >nul 2>nul
if %errorlevel%==0 (
    echo Python nao encontrado. Tentando Node...
    node -e "const h=require('http'),f=require('fs'),p=require('path');h.createServer((q,r)=>{let u=q.url==='/'?'/index.html':q.url;u=decodeURIComponent(u.split('?')[0]);const fp=p.join(__dirname,u);f.stat(fp,(e,s)=>{if(e||!s.isFile()){r.writeHead(404);return r.end('not found')}const ext=p.extname(fp).toLowerCase();const ct={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json'}[ext]||'application/octet-stream';r.writeHead(200,{'Content-Type':ct});f.createReadStream(fp).pipe(r)})}).listen(8000,()=>console.log('Server: http://localhost:8000'))"
    goto :end
)

echo.
echo ERRO: Nem Python nem Node foram encontrados no PATH.
echo Instale Python (https://python.org) ou Node.js (https://nodejs.org).
echo.
pause

:end
echo.
echo Servidor encerrado.
pause
