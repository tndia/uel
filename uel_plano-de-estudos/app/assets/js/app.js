/** app.js — shell, navigation, theme, PWA */
import { loadState, saveState } from "./storage.js";
import { toast } from "./ui.js";

const NAV = [
  { href:"index.html", label:"Painel", hint:"Hoje + visão geral" },
  { href:"setup.html", label:"Configuração", hint:"Curso, metas, agenda" },
  { href:"planner.html", label:"Plano semanal", hint:"Agenda inteligente" },
  { href:"modules.html", label:"Módulos", hint:"Conteúdo completo" },
  { href:"reviews.html", label:"Revisão espaçada", hint:"Fila do dia" },
  { href:"exercises.html", label:"Exercícios", hint:"Quiz + banco" },
  { href:"writing.html", label:"Redação", hint:"Temas + correção" },
  { href:"literature.html", label:"Obras", hint:"Leitura guiada" },
  { href:"simulados.html", label:"Simulados", hint:"Cronômetro + checklists" },
  { href:"calendar.html", label:"Calendário", hint:"Tudo em um lugar" },
  { href:"stats.html", label:"Estatísticas", hint:"Progresso real" },
  { href:"about.html", label:"Sobre", hint:"Referências e versão" },
];

export function renderShell(){
  const state = loadState();
  applyTheme(state);

  const page = document.body.getAttribute("data-page") || "";
  const sidebar = document.getElementById("sidebar");
  const navHtml = NAV.map(item=>{
    const current = (item.href === page) ? `aria-current="page"` : "";
    return `<a href="./${item.href}" ${current}>
      <span>${item.label}</span>
      <span class="hint">${item.hint}</span>
    </a>`;
  }).join("");

  const inner = `
    <div class="brand">
      <div class="logo">
        <span style="font-weight:800;letter-spacing:.2px;">Planner UEL Pro</span>
        <span class="badge">v2 • 2026</span>
      </div>
      <button class="iconbtn" id="themeBtn" type="button" aria-label="Alternar tema">
        <span>🌓</span><span class="hint">Tema</span>
      </button>
    </div>
    <nav class="nav" aria-label="Navegação principal">
      ${navHtml}
    </nav>
    <div class="footer">
      <span class="hint">Local-first • sem login</span>
      <a class="hint" href="./about.html">Referências</a>
    </div>
  `;

  if(sidebar) sidebar.innerHTML = inner;

  // Mobile drawer
  const drawer = document.getElementById("drawer");
  if(drawer){
    drawer.innerHTML = `<div class="sidebar">${inner}</div>`;
  }

  // Theme toggle
  const themeBtn = document.getElementById("themeBtn");
  themeBtn?.addEventListener("click", ()=>{
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    state.config.theme = next;
    saveState(state);
    applyTheme(state);
    toast(`Tema: ${next === "dark" ? "escuro" : "claro"}`);
  });

  // Drawer toggle
  const drawerBtn = document.getElementById("drawerBtn");
  drawerBtn?.addEventListener("click", ()=>{
    drawer.classList.toggle("open");
  });

  // Shortcuts
  document.addEventListener("keydown", (e)=>{
    const k = e.key.toLowerCase();
    if((e.ctrlKey || e.metaKey) && k === "k"){
      e.preventDefault();
      const inp = document.getElementById("globalSearch");
      inp?.focus();
      toast("Busca pronta (Ctrl/⌘ + K)");
    }
  });

  // Global search (optional in pages)
  const search = document.getElementById("globalSearch");
  search?.addEventListener("input", ()=>{
    const q = search.value.trim().toLowerCase();
    const box = document.getElementById("globalSearchResults");
    if(!box) return;
    if(!q){ box.innerHTML = ""; return; }
    const hits = NAV.filter(x=>x.label.toLowerCase().includes(q) || x.hint.toLowerCase().includes(q)).slice(0,6);
    box.innerHTML = hits.map(h=>`<div class="card" style="padding:10px;border-radius:14px;">
        <a href="./${h.href}" style="text-decoration:none;">
          <div style="font-weight:700;">${h.label}</div>
          <div style="color:var(--muted);font-size:12px;margin-top:2px;">${h.hint}</div>
        </a>
      </div>`).join("");
  });

  // PWA / offline
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./assets/js/sw.js", { scope:"./" }).catch(()=>{});
  }
}

function applyTheme(state){
  const saved = state?.config?.theme;
  if(saved){
    document.documentElement.setAttribute("data-theme", saved);
    return;
  }
  // Respect system preference
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  document.documentElement.setAttribute("data-theme", prefersLight ? "light" : "dark");
}
