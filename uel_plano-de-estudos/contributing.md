# Contribuindo

Obrigado por contribuir com o **Planner UEL Pro**!

Este projeto tem dois componentes (docs + app). A prioridade é manter:

- compatibilidade total com GitHub Pages (Jekyll safe mode),
- app simples (HTML/CSS/JS), sem build complexo,
- privacidade (local-first; sem coleta desnecessária).

---

## Como contribuir (fluxo recomendado)

1. **Abra uma issue**
   - bug: descreva o esperado vs o que ocorreu
   - melhoria: descreva o valor/impacto
2. Faça um **fork**
3. Crie uma branch: `feat/nome-curto` ou `fix/nome-curto`
4. Faça commits pequenos e claros
5. Abra um **Pull Request** com:
   - descrição do que mudou e por quê
   - passos de teste
   - screenshots (quando UI)

---

## Onde fazer mudanças

### Docs (Jekyll)

- páginas gerais: `index.md`, `faq.md`, `troubleshooting.md`, `downloads.md`
- coleção de docs: `_docs/`
- referência: `_reference/`
- customização de tema: `assets/css/just-the-docs.scss` e `_includes/*`

**Boas práticas:**
- headings em ordem (H2 → H3), sem pular níveis
- exemplos curtos e verificáveis
- links usando `relative_url` quando estiver no site Jekyll

### App

- telas: `app/*.html`
- lógica: `app/assets/js/*.js`
- dados: `app/assets/data/*.json`
- offline: `app/assets/js/sw.js`

**Boas práticas:**
- manter JS modular e legível
- evitar bibliotecas externas (o foco é funcionar “as-is” no Pages)
- validar JSON antes do commit

---

## Testes manuais (checklist mínimo)

### Site (docs)

- [ ] `bundle exec jekyll serve` abre sem erros
- [ ] navegação lateral funciona
- [ ] links internos não geram 404
- [ ] home, docs, referência, downloads abrem

### App

- [ ] páginas abrem em `/app/`
- [ ] dados são salvos no navegador
- [ ] offline funciona após 1º carregamento
- [ ] export/import (se você mexer nisso) não quebra

---

## Política de segurança e privacidade

- Nunca inclua tokens, chaves ou credenciais no repositório.
- Não inclua dados reais de usuários em exemplos/prints.
- Se adicionar integração externa, documente e mantenha opcional.

---

## Padrão de commits (sugestão)

- `docs: ...` para mudanças de documentação
- `app: ...` para mudanças no app
- `chore: ...` para manutenção/refatoração

---

## Licença

Ao contribuir, você concorda em licenciar sua contribuição sob a mesma licença do projeto (MIT).
