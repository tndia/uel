---
title: "Compatibilidade de navegador"
parent: "Manutenção e dados"
nav_order: 4
---

# Compatibilidade de navegador

O app é um site estático moderno e funciona melhor em navegadores atualizados.

## Requisitos mínimos (práticos)

- suporte a `localStorage`
- suporte a `serviceWorker` (para offline)
- suporte a módulos ES (`type="module"`)

## Dicas

- Em iOS/Safari, o modo “Adicionar à tela inicial” pode melhorar o uso como app.
- Em modo anônimo, o armazenamento pode ser limpo ao fechar.

## Problemas comuns

- **“Perdi meus dados”**: geralmente limpeza de storage. Veja: **[Backup e restauração]({{ "/docs/backup-restore/" | relative_url }})**.
- **“Não atualiza”**: pode ser cache do SW. Veja: **[Modo offline]({{ "/docs/offline/" | relative_url }})**.
