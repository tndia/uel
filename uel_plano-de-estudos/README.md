# Planner UEL Pro — Site (GitHub Pages) + App (local-first)

Este repositório já está pronto para **publicar no GitHub Pages** e contém duas coisas:

1) **Site de documentação** (Jekyll + tema Just the Docs) — na **raiz** do repo  
2) **Aplicação web** em `/app/` (HTML/CSS/JS) — **local-first**, com suporte a **offline** via Service Worker

> Objetivo: um “hub” profissional — landing + docs + referência — e um app acessível em `/app/`.

---

## ✅ Rodar localmente (docs)

Pré-requisitos:
- Ruby + Bundler
- Git

Instalar dependências e rodar:

```bash
bundle install
bundle exec jekyll serve
```

Abra: `http://localhost:4000`

### Simular Project Pages (baseurl)

Se seu site for `https://usuario.github.io/nome-do-repo/`:

```bash
bundle exec jekyll serve --baseurl "/nome-do-repo"
```

---

## 🚀 Publicar no GitHub Pages (recomendado)

1. Vá em **Settings → Pages**
2. Em **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
3. Clique em **Save**

Depois disso, cada push no `main` gera um novo deploy.

### Ajuste de `url` e `baseurl`

Edite `_config.yml`:

- **User/Org Pages:** `baseurl: ""`
- **Project Pages:** `baseurl: "/nome-do-repo"`

> Dica: o site usa links com `relative_url` para reduzir problemas.

### (Opcional) Deploy com GitHub Actions

Use apenas se precisar controlar o build (plugins fora do `github-pages` etc.).  
Existe um exemplo em: `.github/workflows/pages.yml.example` (renomeie para ativar).

---

## ✍️ Como editar conteúdo (sem quebrar o site)

### Landing e páginas

- `index.md` → home
- `faq.md`, `troubleshooting.md`, `downloads.md` → páginas do site

### Documentação (coleção)

- `_docs/` → páginas em `/docs/...`

### Referência (coleção)

- `_reference/` → páginas em `/reference/...`

### App

- `app/*.html` → telas
- `app/assets/js/` → lógica
- `app/assets/data/` → conteúdo base (JSON)
- `app/assets/js/sw.js` → cache offline

---

## 🧭 Estrutura (resumo)

```
.
├─ _docs/                 # coleção “Documentação”
├─ _reference/            # coleção “Referência”
├─ assets/                # CSS/brand/downloads do site
├─ app/                   # aplicação (estática)
├─ _config.yml            # config do Jekyll (Pages-safe)
└─ Gemfile                # ambiente local alinhado ao GitHub Pages
```

---

## 🔐 Segurança e privacidade

Sites do Pages podem ficar públicos dependendo do plano/configuração.  
**Não adicione chaves, tokens, credenciais ou dados sensíveis ao repositório.**

Como o app é local-first, *seus backups podem conter dados pessoais* (texto de redação, histórico). Trate com cuidado.

---

## 🤝 Contribuindo

- Abra uma issue antes de mudanças grandes.
- Prefira PRs pequenos e fáceis de revisar.
- Evite dependências externas e builds complexos (manter Pages simples).

---

## 📜 Licença

MIT — veja `LICENSE`.
