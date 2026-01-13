---
title: "Backup e restauração"
parent: "Manutenção e dados"
nav_order: 1
---

# Backup e restauração

O app salva tudo localmente (no navegador) usando `localStorage`.  
Isso significa: **sem login**, mas **você é responsável pelo backup**.

## Por que você pode perder dados?

- limpeza de dados do navegador,
- modo anônimo/privado,
- reinstalação do sistema,
- extensão que limpa storage,
- múltiplos dispositivos (cada um tem seu próprio storage).

## Como fazer backup (export)

1. No app, abra a área de **sobre** (ou configurações, se houver opção de export).
2. Use a função de **Exportar** e salve o arquivo `.json`.

> O arquivo é texto (JSON). Ele pode conter seu histórico de estudo, então trate como dado pessoal.

## Como restaurar (import)

1. Abra o app.
2. Use **Importar** e selecione o arquivo `.json`.
3. Recarregue a página, se necessário.

## Boas práticas (recomendado)

- Backup **semanal** (domingo) + backup antes de atualização grande.
- Guardar em 2 lugares (computador + nuvem pessoal/pendrive).
- Nomear por data: `backup-2026-01-13.json`.

## Compatibilidade e migração

O estado tem versionamento simples e uma rotina de “merge” mínimo para compatibilidade futura.  
Para detalhes do schema, veja: **[Modelo de dados do storage]({{ "/reference/storage-schema/" | relative_url }})**.
