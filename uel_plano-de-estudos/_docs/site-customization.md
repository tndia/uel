---
title: "Customizar o site (tema)"
parent: "Publicação"
nav_order: 4
---

# Customizar o site (tema)

Este site usa o tema **Just the Docs**, que é responsivo e tem busca embutida.

- Tema: https://just-the-docs.com

Como usamos `remote_theme`, o repositório não precisa “copiar” os arquivos do tema — o tema é baixado no build do Pages.

## Onde personalizar

- `_config.yml` — título, descrição, logo, coleções
- `assets/css/just-the-docs.scss` — overrides de CSS (leve)
- `_includes/head_custom.html` — meta extra / scripts (evite JS pesado)
- `_includes/header_custom.html` / `_includes/footer_custom.html` — links do header/footer

## Boas práticas

- Evite alterar HTML do tema sem necessidade.
- Prefira CSS pequeno e bem documentado.
- Use links com `relative_url` para não quebrar com `baseurl`.
