---
title: "Prompts de redação (writing_prompts.json)"
parent: "Referência"
nav_order: 30
---

# Prompts de redação (`writing_prompts.json`)

Caminho: `app/assets/data/writing_prompts.json`

Usado para sugerir temas e checkpoints de correção.

## Estrutura

```json
{
  "meta": { "...": "..." },
  "prompts": [
    {
      "id": "red-001",
      "axis": "Educação e cidadania",
      "theme": "Educação e cidadania: tema 1",
      "prompt": "Texto do enunciado...",
      "checkpoints": [
        "Delimite o tema em uma tese clara (1 frase).",
        "Traga 2 argumentos com evidências.",
        "Conclua com síntese + encaminhamentos."
      ]
    }
  ]
}
```

## Boas práticas

- `axis` organiza e ajuda a variar repertório.
- Checkpoints devem ser objetivos e avaliáveis.
- Evite prompts muito longos: prefira enunciado + requisitos.

## Extensões úteis

Você pode adicionar campos como `timeLimitMin`, `tags` ou `model` (ex.: ENEM/UEL) sem quebrar o app (o schema preserva chaves desconhecidas).
