---
title: "Rodar localmente"
parent: "Publicação"
nav_order: 2
---

# Rodar localmente

Rodar localmente evita “push e reza”: você valida links, navegação e `baseurl` antes do deploy.

## Pré-requisitos

- Ruby + Bundler
- Git

Este repositório usa o gem `github-pages` para aproximar seu ambiente local do GitHub Pages.

## Passo a passo

```bash
bundle install
bundle exec jekyll serve
```

Acesse: `http://localhost:4000`

## Simular Project Pages (baseurl)

Se seu site for `https://usuario.github.io/nome-do-repo/`, rode:

```bash
bundle exec jekyll serve --baseurl "/nome-do-repo"
```

## Dicas de debug

- Links quebrados quase sempre são `baseurl` incorreto.
- Se o tema não carregar localmente, rode `bundle install` novamente.
- Se você alterou SCSS e não refletiu, reinicie o `jekyll serve`.
