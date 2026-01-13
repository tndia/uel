import { renderShell } from "./app.js";
import { loadContent } from "./content.js";
import { loadState, saveState } from "./storage.js";
import { isoToday, toast } from "./ui.js";

renderShell();
const content = await loadContent();
const state = loadState();
const today = isoToday();

const el = (id)=>document.getElementById(id);

render();

function render(){
  const mods = content.modules.length;
  const mastered = Object.values(state.progress.modules||{}).filter(p=>(p.mastery??0)===3).length;
  const started = Object.keys(state.progress.modules||{}).length;
  const due = Object.values(state.progress.modules||{}).filter(p=>p.nextReview && p.nextReview <= today).length;
  const tasksDone = (state.tasks||[]).filter(t=>t.status==="done").length;
  const tasksTotal = (state.tasks||[]).length;
  const reda = (state.submissions||[]).length;
  const errs = (state.errors||[]).length;
  const sims = (state.progress.simulados||[]).length;

  el("kpiMods").textContent = `${mastered}/${mods}`;
  el("kpiStarted").textContent = `${started}`;
  el("kpiDue").textContent = `${due}`;
  el("kpiTasks").textContent = `${tasksDone}/${tasksTotal}`;
  el("kpiRed").textContent = `${reda}`;
  el("kpiErr").textContent = `${errs}`;
  el("kpiSim").textContent = `${sims}`;

  // Errors by subject
  const bySub = {};
  for(const e of (state.errors||[])){
    const sid = e.subjectId || "outros";
    bySub[sid] = (bySub[sid]||0)+1;
  }
  const rows = Object.entries(bySub).sort((a,b)=>b[1]-a[1]).map(([sid,n])=>{
    const name = content.subjects.find(s=>s.id===sid)?.short || sid.toUpperCase();
    return `<tr><td>${name}</td><td>${n}</td></tr>`;
  }).join("");

  el("errorsTable").innerHTML = rows || `<tr><td colspan="2" style="color:var(--muted);">Sem erros registrados ainda.</td></tr>`;

  drawBars(bySub);
  renderErrorsList();
  renderSimulados();
}

function drawBars(bySub){
  const canvas = document.getElementById("chart");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.clientWidth * devicePixelRatio;
  const h = canvas.height = 220 * devicePixelRatio;

  ctx.clearRect(0,0,w,h);
  const entries = Object.entries(bySub).sort((a,b)=>b[1]-a[1]).slice(0, 10);
  if(!entries.length){
    ctx.fillStyle = "rgba(255,255,255,.45)";
    ctx.font = `${14*devicePixelRatio}px system-ui`;
    ctx.fillText("Sem dados de erros ainda.", 12*devicePixelRatio, 26*devicePixelRatio);
    return;
  }

  const max = Math.max(...entries.map(e=>e[1]));
  const pad = 18*devicePixelRatio;
  const barW = (w - pad*2) / entries.length;

  entries.forEach(([sid,n], i)=>{
    const x = pad + i*barW + barW*0.1;
    const bh = (h - pad*2) * (n / max);
    const y = h - pad - bh;
    // bar (no explicit colors—use current text color w/ alpha)
    ctx.fillStyle = "rgba(255,255,255,.28)";
    ctx.fillRect(x, y, barW*0.8, bh);
    // label
    const name = (content.subjects.find(s=>s.id===sid)?.short || sid.toUpperCase()).slice(0,6);
    ctx.fillStyle = "rgba(255,255,255,.65)";
    ctx.font = `${11*devicePixelRatio}px system-ui`;
    ctx.fillText(name, x, h - pad + 14*devicePixelRatio);
    ctx.fillText(String(n), x, y - 6*devicePixelRatio);
  });
}

function renderErrorsList(){
  const list = (state.errors||[]).slice(0, 12);
  el("errorsList").innerHTML = list.map(e=>`
    <div class="card" style="padding:12px;">
      <div style="font-weight:900;">${eh(e.what).slice(0,120)}${(e.what||"").length>120?"…":""}</div>
      <div class="meta">
        <span class="pill">${eh(e.date)}</span>
        ${e.subjectId?`<span class="pill">${e.subjectId.toUpperCase()}</span>`:""}
        ${e.moduleId?`<a class="pill" href="./module.html?id=${encodeURIComponent(e.moduleId)}">módulo</a>`:""}
      </div>
      ${e.fix?`<div style="margin-top:10px;color:var(--muted);"><strong>Correção:</strong> ${eh(e.fix)}</div>`:""}
    </div>
  `).join("") || `<div class="notice">Registre erros em Exercícios e Módulos para acelerar evolução.</div>`;

  document.getElementById("btnClearErrors").addEventListener("click", ()=>{
    if(!confirm("Limpar todos os erros registrados?")) return;
    state.errors = [];
    saveState(state);
    toast("Erros apagados.");
    render();
  });
}

function renderSimulados(){
  const list = (state.progress.simulados||[]).slice(0, 8);
  el("simulados").innerHTML = list.map(s=>`
    <div class="card" style="padding:12px;">
      <div style="font-weight:900;">${eh(s.kind)}</div>
      <div style="color:var(--muted);font-size:12px;margin-top:2px;">${eh(s.date)} • ${eh(s.score||"")}</div>
    </div>
  `).join("") || `<div class="notice">Nenhum simulado salvo ainda.</div>`;
}

function eh(str){ return (str??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
