---
title: "Publicar no GitHub Pages"
parent: "Publicação"
nav_order: 1
---

# Publicar no GitHub Pages

O GitHub Pages pode publicar seu site de duas formas:

1) **Deploy from a branch** (build padrão do Pages)  
2) **GitHub Actions** (build customizado e deploy)

Para este repositório, a opção mais simples e robusta é **Deploy from a branch** porque:
- usamos tema via `remote_theme`,
- usamos apenas plugins permitidos,
- não há build customizado do app.

Documentação oficial:  
- GitHub Pages (configuração): https://docs.github.com/en/pages

---

## A) Publicar a partir de um branch (recomendado)

### 1. Pré-requisito
Seu conteúdo do site está na **raiz do repositório** (este template já está).

### 2. Configurar no GitHub (cliques)
1. Abra **Settings** do repositório
2. Vá em **Pages**
3. Em **Build and deployment → Source**, selecione **Deploy from a branch**
4. Em **Branch**, selecione:
   - Branch: `main`
   - Folder: `/ (root)`
5. Clique em **Save**

### 3. Ajustar `url` e `baseurl` (muito importante)

No `_config.yml`:

- **Project Pages** (URL com o nome do repo):  
  `https://usuario.github.io/nome-do-repo/`

```yml
url: "https://usuario.github.io"
baseurl: "/nome-do-repo"
```

- **User/Org Pages** (URL sem nome de repo):  
  `https://usuario.github.io/`

```yml
url: "https://usuario.github.io"
baseurl: ""
```

> Dica: este site usa `relative_url` nos links, o que reduz erros de `baseurl`.

---

## B) Quando usar GitHub Actions

Use Actions se você precisar de:
- plugins fora do `github-pages`,
- build customizado,
- controle de versão de Ruby/Gems,
- etapas extras (ex.: gerar docs a partir de outra fonte).

Guia oficial (Actions + Pages):  
https://docs.github.com/en/pages/getting-started-with-github-pages/using-github-actions-with-pages

Existe um workflow opcional em:
`.github/workflows/pages.yml.example` (renomeie para ativar).

---

## Domínio customizado (CNAME)

Se você já usa domínio:

1. Mantenha/crie um arquivo **`CNAME`** na raiz com seu domínio (uma linha).
2. Em **Settings → Pages**, configure **Custom domain**.
3. Ajuste DNS conforme instruções do GitHub.

Aviso: não coloque tokens/segredos no repositório.
