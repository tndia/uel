---
title: "Modo offline (PWA)"
parent: "Manutenção e dados"
nav_order: 2
---

# Modo offline (PWA)

O app registra um Service Worker simples para cachear arquivos essenciais (HTML/CSS/JS/dados).  
Isso permite abrir o app mesmo sem internet *depois do primeiro carregamento*.

## Como confirmar que está offline

1. Abra o app normalmente.
2. Depois, desligue a internet.
3. Recarregue a página: o app deve abrir.

## Limitações (importante)

- O cache é focado no app **em /app/**.
- Se você mudar o app e publicar uma nova versão, o cache antigo pode permanecer até a próxima atualização do SW.

## Forçar atualização

- Recarregue a página com hard refresh (varia por navegador).
- Ou limpe o “armazenamento do site” nas configurações do navegador (isso também limpa dados — faça backup antes!).

## Referência técnica

- Lista de arquivos “core” cacheados: **[Service Worker e cache]({{ "/reference/service-worker-cache/" | relative_url }})**.
