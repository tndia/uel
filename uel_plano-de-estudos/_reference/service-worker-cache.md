---
title: "Service Worker e cache"
parent: "Referência"
nav_order: 35
---

# Service Worker e cache

Arquivo: `app/assets/js/sw.js`

O Service Worker implementa um cache simples (Cache Storage) para permitir uso offline.

## Estratégia

- Cache **prévio** (install): adiciona um conjunto “core” de arquivos essenciais.
- Cache **dinâmico** (fetch): se não estiver no cache, busca e armazena.

## Versionamento

A variável `CACHE` define o nome do cache.  
Quando você muda esse valor (ex.: `v2` → `v3`), o SW apaga caches antigos no `activate`.

> Boa prática: troque o `CACHE` quando fizer mudanças grandes de assets.

## Lista de arquivos core

O array `CORE` inclui HTML das páginas do app, CSS/JS e JSON de dados.  
Se você adicionar novas páginas/arquivos essenciais, inclua aqui também.

## Armadilhas

- Se o app “não atualiza”, normalmente é cache.
- Limpar dados do site remove cache **e** progresso (faça backup antes).
