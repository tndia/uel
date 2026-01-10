# Planner UEL Pro (GitHub Pages)

Um **planner completo e offline** para o Vestibular UEL (foco 2026), com:
- Plano semanal inteligente (por disponibilidade, forças e — se aplicável — **discursiva**)
- **Revisão espaçada** (módulos + flashcards)
- Banco interno de exercícios (quiz com explicações) + **registro de erros**
- Redação: banco de temas, editor com timer, histórico e exportação
- Obras literárias (lista oficial 2025–2027) + plano de leitura
- Simulados com cronômetro e registro

> Tudo funciona **sem backend** e **sem login**: seus dados ficam no `localStorage` do navegador.
> Faça backup em `Configuração → Exportar`.

## Como publicar no GitHub Pages

1. Crie um repositório (ex.: `planner-uel`)
2. Faça upload de **todos os arquivos** deste projeto (a raiz contém `index.html`)
3. Em **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**

## Atualização de conteúdo (dados)

Os dados ficam em:
- `assets/data/content.json` (matérias, módulos, obras, modelo de prova)
- `assets/data/exercises.json` (banco de questões)
- `assets/data/writing_prompts.json` (temas de redação)
- `assets/data/references.json` (referências / links)

## Referências oficiais
Veja a página **Sobre** no app para links e documentos oficiais da UEL.

---

Gerado em: 2026-01-09
