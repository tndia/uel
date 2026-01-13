---
title: "Editar conteúdo do app (JSON)"
parent: "Manutenção e dados"
nav_order: 5
---

# Editar conteúdo do app (JSON)

O app usa arquivos JSON para conteúdo base. Isso permite manter tudo simples e versionado no GitHub.

## Arquivos

- `app/assets/data/content.json` — matérias, módulos, obras
- `app/assets/data/exercises.json` — banco de exercícios
- `app/assets/data/writing_prompts.json` — prompts de redação

## Boas práticas

- Não mude IDs antigos (isso quebra progresso de usuários).
- Prefira adicionar novos itens.
- Se precisar “aposentar” algo, use tags e esconda via UI (ou documente).

## Validar antes de publicar

Use um validador JSON ou rode localmente e navegue pelo app.

Referência de schema:
- [content.json]({{ "/reference/content-data/" | relative_url }})
- [exercises.json]({{ "/reference/exercises-data/" | relative_url }})
- [writing_prompts.json]({{ "/reference/writing-prompts/" | relative_url }})
