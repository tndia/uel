---
title: "Modelo de conteúdo (content.json)"
parent: "Referência"
nav_order: 20
---

# Modelo de conteúdo (`content.json`)

Caminho: `app/assets/data/content.json`

Este arquivo define o **conteúdo base** do app:

- matérias (`subjects`)
- módulos (`modules`)
- literatura (`literature`)
- metadados (modelo de prova e trilhas)

## Estrutura principal

```json
{
  "meta": { "...": "..." },
  "examModel": { "...": "..." },
  "subjects": [ { "id": "lp", "name": "Língua Portuguesa...", "short": "Português" } ],
  "modules": [
    {
      "id": "lp_mod_01",
      "subjectId": "lp",
      "title": "Interpretação",
      "goals": ["..."],
      "checklist": ["..."],
      "resources": [ { "title": "...", "url": "..." } ],
      "practice": ["..."],
      "tags": ["..."],
      "estSessions": 2
    }
  ],
  "coursesDiscursive": [ "..."],
  "literature": [ { "id": "obra_01", "title": "...", "author": "..." } ]
}
```

## Convenções recomendadas

- `id` deve ser estável (não mude IDs após publicar — isso quebra progresso).
- `subjectId` deve existir em `subjects`.
- `resources.url` deve ser link estável (evite links que expiram).

## Como adicionar um módulo

1. Escolha a matéria (`subjectId`)
2. Crie um `id` único e estável (ex.: `lp_mod_10`)
3. Preencha objetivos/checklist/prática
4. Ajuste `estSessions` (estimativa de sessões)

## Impacto no app

- A lista de módulos é usada em **Módulos**, **Plano semanal**, **Revisões** e **Estatísticas**.
- Se você remover módulos existentes, usuários podem ver “lacunas” no progresso.

> Boa prática: em vez de remover, prefira marcar como “deprecated” por tag e esconder via filtro.
