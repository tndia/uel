# Planner UEL Pro — GitHub Pages sem Actions (robusto)

Este repositório já vem pronto para **publicar no GitHub Pages no plano gratuito, sem Jekyll e sem GitHub Actions**.

## ✅ Como publicar (recomendado)

1. Faça upload da pasta **`docs/`** (ela é o “site publicado”).
2. No GitHub, vá em **Settings → Pages**.
3. Em **Build and deployment** selecione:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main`
   - **Folder:** `/docs`
4. Salve.

Pronto: a home fica em:

- `https://SEU_USUARIO.github.io/SEU_REPO/`

Exemplo (seu caso): `https://tndia.github.io/uel/`

> Importante: o arquivo `docs/.nojekyll` já está incluído para o Pages **não** tentar compilar nada com Jekyll.

## 📁 O que tem aqui

- `docs/` → site **estático** final (HTML/CSS/JS) com:
  - layout moderno, responsivo (mobile/desktop/ultrawide)
  - sidebar + TOC + breadcrumbs
  - busca interna (Ctrl/⌘ + K)
  - tema claro/escuro/auto
  - sitemap + robots + 404
  - app completo em `docs/app/`
- `site-src/` → o “conteúdo fonte” original (Markdown etc.) apenas para referência

## 🔧 Se der 404

No GitHub Pages, **só dá pra publicar da raiz (`/`) ou de `/docs`**. Se você colocar tudo dentro de outra pasta (ex: `uel_plano-de-estudos/`), vai dar 404 porque o Pages não publica de subpastas.

Use **`/docs`** como acima.

---
Se quiser, dá pra ir evoluindo o conteúdo aos poucos mantendo a estrutura (e ainda assim sem depender de Actions).
