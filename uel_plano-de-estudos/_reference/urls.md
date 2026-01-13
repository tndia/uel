---
title: "Rotas e URLs"
parent: "Referência"
nav_order: 40
---

# Rotas e URLs

Este projeto é hospedado como site estático.

## Site (Jekyll)

- Home: `/`
- Docs: `/docs/…`
- Referência: `/reference/…`
- Downloads: `/downloads/`
- 404: `/404.html`

As URLs são “bonitas” (`permalink: pretty`).

## App

O app fica em:

- `/app/` (index)
- páginas: `/app/planner.html`, `/app/reviews.html`, etc.

Isso foi feito para não depender do Jekyll dentro do app.

## Project Pages vs User Pages

No GitHub Pages:

- User/Org Pages: `https://usuario.github.io/`
- Project Pages: `https://usuario.github.io/nome-do-repo/`

Por isso o site usa `relative_url` e o `_config.yml` tem `baseurl`.

Guia: **[Publicar no GitHub Pages]({{ "/docs/publish/" | relative_url }})**.
