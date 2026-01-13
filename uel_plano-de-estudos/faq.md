---
title: "FAQ"
nav_order: 60
---

# FAQ

## O app é “online”? Precisa de login?

Não. Ele é **local‑first**: roda no navegador e não exige login. Os dados ficam no seu dispositivo.

## Vou perder meus dados?

Você pode perder se o navegador limpar o armazenamento (limpeza, modo anônimo, reinstalação, etc.).  
Por isso, faça **backup semanal**: **[Backup e restauração]({{ "/docs/backup-restore/" | relative_url }})**.

## Funciona no celular?

Sim. O layout é responsivo e você pode usar como “app” fixando na tela inicial (varia por sistema).

## Funciona sem internet?

Depois do primeiro carregamento, o app usa cache offline (Service Worker).  
Veja: **[Modo offline]({{ "/docs/offline/" | relative_url }})**.

## Posso mudar o conteúdo (módulos, banco, obras)?

Sim. O conteúdo do app está em JSON:

- `app/assets/data/content.json`
- `app/assets/data/exercises.json`
- `app/assets/data/writing_prompts.json`

Veja a referência: **[Modelo de conteúdo]({{ "/reference/content-data/" | relative_url }})**.

## Isso é oficial da UEL?

Não. É um projeto comunitário para organização de estudo.

## Como contribuir?

Veja: **[Contribuindo]({{ "/contributing/" | relative_url }})**.
