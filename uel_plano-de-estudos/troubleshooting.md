---
title: "Troubleshooting"
nav_order: 70
---

# Troubleshooting

## O site (docs) aparece em branco / CSS quebrado

Quase sempre é `baseurl` incorreto.

- **Project Pages**: `baseurl: "/nome-do-repo"`
- **User Pages**: `baseurl: ""`

Guia: **[Publicar no GitHub Pages]({{ "/docs/publish/" | relative_url }})**.

## Links internos quebrados (404)

- Confirme se você está usando links com `relative_url` (no site Jekyll).
- Rode localmente simulando `baseurl`:

```bash
bundle exec jekyll serve --baseurl "/nome-do-repo"
```

## O app não atualiza depois do deploy

Pode ser cache do navegador ou do Service Worker.

1. Faça hard refresh
2. Se persistir, limpe dados do site (cuidado: isso apaga seu progresso → faça backup antes!)

Veja: **[Modo offline]({{ "/docs/offline/" | relative_url }})**.

## Perdi meus dados

Se você tem um backup `.json`, é só importar.

Guia: **[Backup e restauração]({{ "/docs/backup-restore/" | relative_url }})**.

Se não tem backup:
- tente ver se outro navegador/perfil tem os dados,
- verifique se você estava em modo anônimo.

## “Rodando localmente” dá erro de gems

- Confirme que você tem Ruby + Bundler.
- Rode `bundle install` de novo.
- O gem `github-pages` ajuda a alinhar versões.

## Onde reportar bugs?

Abra uma issue no repositório (link em **Contato**).
