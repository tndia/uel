---
title: "Banco de exercícios (exercises.json)"
parent: "Referência"
nav_order: 25
---

# Banco de exercícios (`exercises.json`)

Caminho: `app/assets/data/exercises.json`

Define o banco de questões (formato simples, tipo quiz).

## Estrutura

```json
{
  "meta": { "...": "..." },
  "exercises": [
    {
      "id": "lp1",
      "subjectId": "lp",
      "stem": "Enunciado...",
      "choices": ["A", "B", "C", "D"],
      "answerIndex": 1,
      "explanation": "Explicação (por que a alternativa é correta)",
      "tags": ["argumentação"],
      "difficulty": 1
    }
  ]
}
```

## Regras recomendadas

- `id` deve ser único e estável.
- `subjectId` deve existir em `content.json/subjects`.
- `answerIndex` deve apontar para `choices` (0‑based).
- `difficulty`: use escala curta (ex.: 1 a 3) para manter consistência.

## Boas práticas de conteúdo

- Enunciado claro (sem “pegadinha” sem objetivo).
- Explicação curta e útil (evite só “porque sim”).
- Tags ajudam a filtrar e planejar revisões.

## Dica: adicionar fonte

Se você quiser, pode adicionar `source` e `year` (campos extras) — o schema do storage preserva chaves desconhecidas.
