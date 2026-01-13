---
title: "Arquitetura do repositório"
parent: "Publicação"
nav_order: 3
---

# Arquitetura do repositório

Este repositório tem **duas camadas**:

## 1) Site (Jekyll) — raiz do repo

Objetivo: documentação, navegação, páginas institucionais e SEO básico.

- `_config.yml` — configurações do Jekyll/tema/coleções
- `index.md` — landing
- `_docs/` — coleção de documentação (gera URLs em `/docs/...`)
- `_reference/` — coleção de referência (gera URLs em `/reference/...`)
- `assets/` — CSS/brand do site e downloads

## 2) App estático — `/app/`

Objetivo: aplicação local-first (HTML/CSS/JS), sem build.

- `/app/*.html` — telas do app
- `/app/assets/js/` — lógica (ESM)
- `/app/assets/data/` — banco de conteúdo (JSON)
- `/app/assets/js/sw.js` — cache offline

## Por que separar?

- O Pages/Jekyll cuida da documentação (sem “compilar” o app).
- O app permanece simples (sem pipeline).
- Você pode evoluir docs e app independentemente.

## Convenções de links (para não quebrar no Pages)

- No site Jekyll, use sempre `relative_url` (já aplicado nos links principais).
- No app, os links são relativos dentro de `/app/` e não dependem de Jekyll.

## Onde mexer quando…

- Quer mudar o texto do site → `index.md` e páginas `.md`
- Quer adicionar docs → `_docs/` e `_reference/`
- Quer alterar comportamento do app → `/app/assets/js/`
- Quer alterar conteúdo do app → `/app/assets/data/*.json`
