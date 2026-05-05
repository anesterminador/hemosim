@echo off
setlocal enabledelayedexpansion
title Deploy Simulador Hemosphere
cd /d "%~dp0"

echo.
echo ============================================================
echo   Deploy Simulador Hemosphere
echo   github.com/anesterminador/hemosim
echo ============================================================
echo.

REM ---- 1) Git instalado? -----------------------------------------
where git >nul 2>nul
if errorlevel 1 (
    echo [ERRO] Git nao encontrado.
    echo Instale: https://git-scm.com/download/win
    goto :fim
)
for /f "tokens=*" %%v in ('git --version') do echo Git: %%v

REM ---- 1b) Configura Git Credential Manager ----------------------
REM Quando precisar autenticar, abre o navegador padrao automaticamente.
git config --global credential.helper manager >nul 2>nul

REM ---- 1c) Configura identidade global (so se ainda nao houver) --
git config --global user.email >nul 2>nul
if errorlevel 1 (
    git config --global user.email "anesterminador@users.noreply.github.com"
    echo [INFO] Identidade global configurada: anesterminador
)
git config --global user.name >nul 2>nul
if errorlevel 1 (
    git config --global user.name "anesterminador"
)

REM ---- 1c) Garante identidade do git ----------------------------
REM Sem user.name/email o commit falha. Define defaults se faltarem.
for /f "tokens=*" %%n in ('git config --global user.name 2^>nul') do set "GIT_NAME=%%n"
if "!GIT_NAME!"=="" (
    echo [INFO] Configurando user.name = anesterminador
    git config --global user.name "anesterminador"
)
for /f "tokens=*" %%e in ('git config --global user.email 2^>nul') do set "GIT_EMAIL=%%e"
if "!GIT_EMAIL!"=="" (
    echo [INFO] Configurando user.email = anesterminador@users.noreply.github.com
    git config --global user.email "anesterminador@users.noreply.github.com"
)
REM Suprime warning de fim de linha LF/CRLF
git config --global core.autocrlf true >nul 2>nul

REM ---- 2) Verifica se ja existe um git repo VALIDO --------------
REM (testa de verdade, nao so se a pasta .git existe — pode estar corrompida)
git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
    echo.
    echo [INFO] Inicializando repositorio git...
    REM Se .git existe mas esta corrompida, remove primeiro
    if exist ".git\" (
        echo [INFO] Removendo .git corrompida da execucao anterior...
        rmdir /s /q ".git" 2>nul
        if exist ".git\" (
            echo [ERRO] Nao consegui remover .git. Apague manualmente
            echo a pasta ".git" e rode o batch novamente.
            goto :fim
        )
    )
    git init -b main
    if errorlevel 1 (
        echo [ERRO] Falhou ao inicializar git.
        goto :fim
    )
)

REM ---- 3) Garante o remote correto -------------------------------
git remote get-url origin >nul 2>nul
if errorlevel 1 (
    echo [INFO] Adicionando remote origin...
    git remote add origin https://github.com/anesterminador/hemosim.git
    if errorlevel 1 (
        echo [ERRO] Falhou ao adicionar remote.
        goto :fim
    )
) else (
    git remote set-url origin https://github.com/anesterminador/hemosim.git
)

REM ---- 4) Mensagem do commit -------------------------------------
set "MSG=%~1"
if "!MSG!"=="" (
    for /f "tokens=1-3 delims=/ " %%a in ("%date%") do (
        set "DD=%%a"
        set "MM=%%b"
        set "YYYY=%%c"
    )
    for /f "tokens=1-2 delims=:." %%a in ("%time%") do (
        set "HH=%%a"
        set "MIN=%%b"
    )
    set "MSG=Update !YYYY!-!MM!-!DD! !HH!:!MIN!"
)
echo.
echo Mensagem do commit: "!MSG!"
echo.

REM ---- 5) Status atual -------------------------------------------
echo --- Status ---
git status -s
echo --------------
echo.

REM ---- 6) Add + Commit -------------------------------------------
echo [1/2] Adicionando e commitando...
git add -A
if errorlevel 1 (
    echo [ERRO] Falhou no git add.
    goto :fim
)
REM Verifica se ha algo pra commitar antes de tentar
git diff --cached --quiet
if errorlevel 1 (
    REM Tem mudancas em staging — faz o commit
    git commit -m "!MSG!"
    if errorlevel 1 (
        echo [ERRO] Falhou no commit. Verifique os erros acima.
        goto :fim
    )
) else (
    echo [INFO] Nada novo a commitar.
    REM Se o repo estiver vazio (zero commits), nao pode pular ate o push
    git rev-parse HEAD >nul 2>nul
    if errorlevel 1 (
        echo [ERRO] Repo vazio e nada pra commitar. Adicione algum arquivo.
        goto :fim
    )
)

REM ---- 7) Push ----------------------------------------------------
echo.
echo [2/2] Fazendo push para origin/main...
echo (pode pedir login no navegador na primeira vez)
echo.
git push -u origin main
if errorlevel 1 (
    echo.
    echo [ERRO] Falhou no push. Possiveis causas:
    echo   - Sem conexao com internet
    echo   - Sem autenticacao do GitHub
    echo   - Sem permissao no repositorio
    goto :fim
)

echo.
echo ============================================================
echo   Deploy concluido com sucesso!
echo   Site: https://anesterminador.github.io/hemosim/
echo   (GitHub Pages pode levar 1-2 min para atualizar)
echo ============================================================

:fim
echo.
echo Pressione qualquer tecla para fechar...
pause >nul
endlocal
