---
title: "Schema do storage"
parent: "Referência"
nav_order: 15
---

# Schema do storage

O app salva estado no `localStorage` usando a chave:

- `uel_planner_pro:v2`

Arquivo-fonte: `app/assets/js/storage.js`.

## Estrutura (alto nível)

```json
{
  "meta": { "createdAt": "...", "updatedAt": "...", "version": "2.0.0" },
  "config": {
    "examDate": "YYYY-MM-DD",
    "track": "geral|discursiva",
    "targetCourse": "",
    "language": "ingles|espanhol",
    "sessionMinutes": 50,
    "weeklyHoursTarget": 18,
    "availability": { "mon": 120, "tue": 120, "...": 120 },
    "strengths": { "lp": 2, "mat": 1 }
  },
  "progress": {
    "modules": {
      "lp_mod_01": { "mastery": 2, "lastStudied": "...", "nextReview": "...", "lapses": 1 }
    },
    "streak": { "current": 0, "best": 0, "lastActive": "" },
    "pomodoro": { "totalMinutes": 0, "sessions": [ { "date": "YYYY-MM-DD", "minutes": 50, "subjectId": "lp" } ] }
  },
  "tasks": [],
  "flashcards": [],
  "submissions": [],
  "errors": []
}
```

## Campos importantes

- `config.availability`: minutos por dia (base do plano semanal)
- `progress.modules`: progresso e revisões por módulo
- `errors`: banco de erros (o que/por quê/como corrigir)
- `submissions`: redações registradas

## Compatibilidade (migração)

A função `migrate()` faz um merge simples:
- garante que campos essenciais existam,
- preserva chaves desconhecidas (forward‑compat).

Isso facilita evoluir versões sem quebrar backups antigos.
