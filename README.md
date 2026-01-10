# Planejamento de Estudos — Vestibular UEL (site offline + GitHub Pages)

Este pacote é um mini-site **estático** (HTML/CSS/JS) que funciona:
- **Offline** (basta abrir o `index.html` no navegador), e também
- **Online** via **GitHub Pages**.

Ele inclui: planejamento semanal automático, módulos por disciplina, exercícios, simulados e revisão programada (spaced repetition), além de exportação/importação do progresso.

## Arquivos
- `index.html` — página principal
- `styles.css` — estilos
- `data.js` — conteúdo (módulos, exercícios e referências)
- `app.js` — lógica do planner (plano, revisão, progresso)
- `.nojekyll` — evita processamento do Jekyll no GitHub Pages (recomendado)

## Como usar offline
1. Extraia o ZIP em qualquer pasta.
2. Abra o arquivo `index.html` (clique duplo).
3. Personalize a data da prova, horas/semana e trilha (A/B).
4. Use **Exportar** para fazer backup do progresso.

## Publicar no GitHub + GitHub Pages (passo a passo)
### Método 1 — Pelo navegador (sem instalar nada)
1. Crie um repositório no GitHub (ex.: `planner-uel`).
2. Entre no repositório e clique em **Add file → Upload files**.
3. Arraste **todos os arquivos deste ZIP** (eles devem ficar na raiz do repositório).
4. Clique em **Commit changes**.
5. Vá em **Settings → Pages** e em **Build and deployment** selecione:
   - **Source**: *Deploy from a branch*
   - **Branch**: `main` e **/(root)**
6. Salve. Em alguns instantes o GitHub exibirá o link do seu site.

### Método 2 — Com Git (linha de comando)
1. Crie um repositório no GitHub.
2. No seu computador, extraia o ZIP em uma pasta.
3. No terminal, dentro da pasta, rode:
   ```bash
   git init
   git add .
   git commit -m "Publicar planner UEL"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
   git push -u origin main
   ```
4. Habilite o GitHub Pages: **Settings → Pages → Deploy from a branch → main / (root)**.

## Dicas e solução de problemas
- **404 no GitHub Pages**: verifique se existe `index.html` na raiz e se o Pages está apontando para `main / (root)`.
- Se você trocar de computador/navegador, use **Exportar/Importar** para levar seu progresso.
- Links para PDFs e páginas oficiais exigem internet.

Bom estudo! 📚
